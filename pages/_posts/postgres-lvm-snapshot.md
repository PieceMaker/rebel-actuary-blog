---
title: PostgreSQL LVM Snapshotting
date: 2019-12-15
updated: 2019-12-22
layout: page
---

As a test engineer, I need the ability to quickly reset changes I have made to databases, either directly or indirectly.
Microsoft SQL Server (MSSQL) has the ability to create and reset database-level snapshots and this functionality has
proven quite invaluable in my testing. Not only is it easy to create and reset snapshots, but the process is fast--at
least, it has been in my use cases. Unfortunately, I also work a lot with PostgreSQL (Postgres) and at the time of this
writing, such a snapshot-revert system does not exist. Supposedly the
[Point-in-Time Recovery](https://www.postgresql.org/docs/10/continuous-archiving.html) (PiTR) system can be used to
snapshot a database and then revert it, but this involves performing a full database restore and then replaying the
WAL files until the point the snapshot occurred. This can take quite a bit of time, especially if the database is large.
I searched to no avail for an open source tool or plugin that would accomplish this task but eventually settled on a
method of using [Linux LVM](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)) to accomplish this task for
me.

## Background

In my testing, I started running Postgres inside Docker because it simplified my setup and deployment. Because I was
running Postgres this way, I started looking for Docker plugins that might allow snapshotting and resetting of
Docker volumes. My hope was that I could keep the Postgres data directory inside a Docker volume while keeping the
rest of the system in the main container.

My initial attempt was to try to use the [Convoy](https://github.com/rancher/convoy) plugin created by the Rancher
team. However, I could never get the behavior I desired. Another solution was
[proposed](https://github.com/moby/moby/issues/33782) by a team at
[NetApp](https://netapp.io/2017/06/22/snapshots-clones-docker-volume-paradigm/). This solution was quite appealing as
it would have added snapshot and reversion functionality directly to the `docker volume` command. Unfortunately it
has since been abandoned.

A few other solutions were explored but none panned out.

## LVM

Since a pre-existing solution didn't seem to exist it was time to come up with my own. I decided to see if I could make
use of the snapshot and restore functionality that is part of LVM. The method in this section was developed with much
help from [this TecMint tutorial.](https://www.tecmint.com/take-snapshot-of-logical-volume-and-restore-in-lvm/).

### Loopback

For simplicity, this article uses a file loopback. This is sufficient for development but should never be used for
production. This article assumes a loopback file exists at `/var/lib/postgresql/data.vol` and is mounted at
`/dev/loop5`. You can create and mount it as follows:

```bash
sudo su postgres
truncate -s 150G /var/lib/postgresql/data.vol
exit
sudo losetup /dev/loop5 /var/lib/postgresql/data.vol
```

Note, I chose 150G as this size is sufficient for the database I am using. Your size will likely differ.

### Ubuntu Thin Provisioning

Ensure thin provisioning tools are available in Ubuntu.

```bash
sudo apt-get update
sudo apt-get install thin-provisioning-tools
```

### Volumes

LVM requires you to specify three bits of information for storage:

1. Physical volumes
2. Volumes groups
3. Logical volumes

Note, the following volume commands will be run as the root user. This can be done by using `sudo` or by logging in as
root, the option chosen here.

#### Physical Volumes

The physical volumes represent available storage media. These are typically partitions and/or hard disks that can be
used for storage, but in our example it will be a loopback device. To register our loopback device as a physical volume
we run

```bash
pvcreate /dev/loop5
# Physical volume "/dev/loop5" successfully created
pvs -a
# PV                        VG     Fmt  Attr PSize   PFree 
# /dev/loop5                       lvm2 ---  150.00g 150.00g
```

#### Volume Groups

Next we need to add a volume group. Volume groups can consist of multiple physical volumes grouped together, but in our
cases we will only use our single loopback physical volume. To add this volume to a group we will call "docker", run the
following:

```bash
vgcreate docker /dev/loop5
# Volume group "docker" successfully created
vgs -a
# VG     #PV #LV #SN Attr   VSize   VFree 
# docker   1   0   0 wz--n- 150.00g 150.00g
```

#### Logical Volumes

Now that we have a volume group, we can start adding logical volumes. Logical volumes can have either thick or thin
provisioning with LVM. We will be creating thinly provisioned volumes for our snapshots. To do this we must first create
a thin provisioning pool which will be the total size of the storage space we have to work with. From here, when we
create thin volumes we will create them inside this pool.

To create our thin pool, run the following command. Note that we use the option `-l 100%FREE` to specify that the thin
pool should be assigned all free space in the volume group.

```
lvcreate -l 100%FREE --thinpool thin_pool docker
# Logical volume "thin_pool" created.
lvs -a
# LV                VG     Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
# [lvol0_pmspare]   docker ewi-------  76.00m                                                    
# thin_pool         docker twi-a-tz-- 149.85g             0.00   0.44                            
# [thin_pool_tdata] docker Twi-ao---- 149.85g                                                    
# [thin_pool_tmeta] docker ewi-ao----  76.00m
```

Now that the thin pool has been created, we can add a thin volumes and snapshots. The data directory for the mapping
Postgres instance is about 134GB. However, since we are using thin provisioning let us create a 149GB volume for our
data.

```bash
lvcreate -V 149GB --thin --name thin_volume_1 docker/thin_pool
# Logical volume "thin_volume_1" created.
lvs -a
# LV                VG     Attr       LSize   Pool      Origin Data%  Meta%  Move Log Cpy%Sync Convert
# [lvol0_pmspare]   docker ewi-------  76.00m                                                         
# thin_pool         docker twi-a-tz-- 149.85g                  0.00   0.44                            
# [thin_pool_tdata] docker Twi-ao---- 149.85g                                                         
# [thin_pool_tmeta] docker ewi-ao----  76.00m                                                         
# thin_volume_1     docker Vwi-a-tz-- 149.00g thin_pool        0.00
```

When we create a snapshot, we will also be adding it to this pool. Sizes are not specified with thin snapshots, but as
long as the combined usage of the volume and the snapshot does not exceed the size of the pool (149.85G) we will be
okay.

Now that we have our volume, lets format it with an EXT4 file system and mount it.

```bash
mkdir /mnt/vol1
mkfs.ext4 /dev/docker/thin_volume_1
mount /dev/docker/thin_volume_1 /mnt/vol1
df -h
# Filesystem                        Size  Used Avail Use% Mounted on
# /dev/mapper/docker-thin_volume_1  147G   60M  140G   1% /mnt/vol1
```

### Snapshotting

#### Create

Now that the volumes have been created, restore your database to the volume and start your server. You can now create
a snapshot. The logical volume can remain mounted and in use during the creation of the snapshot. To create the
snapshot, run the following as the root user:

```bash
lvcreate -s --name thin_volume_1_snapshot docker/thin_volume_1
```

Now that the snapshot has been created, you are good to change and modify the PostgreSQL data however you wish.

#### Revert

Once you are finished making changes and want to revert to the initial state of the database, you must first stop
Postgres. Once this is done, run the following commands as root:

```bash
umount /mnt/vol1
lvconvert --merge docker/thin_volume_1_snapshot
lvcreate -s --name thin_volume_1_snapshot docker/thin_volume_1
mount /dev/docker/thin_volume_1 /mnt/vol1
```

The first command unmounts the logical volume. The second command, resets the logical volume to the state it was at
whenever "thin_volume_1_snapshot" was created. By running this command, the snapshot is removed which is why we run the
third command to create a new snapshot. Finally, we remount the reverted logical volume. We can now restart Postgres and
our data and server should be as they were when we created the initial snapshot.