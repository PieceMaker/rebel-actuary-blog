---
title: PostgreSQL LVM Snapshotting
date: 2019-12-15
updated: 2019-12-22
layout: page
---

As a test engineer, I need the ability to quickly reset changes I have made to databases, either directly or indirectly.
Microsoft SQL Server (MSSQL) has the ability to create and reset database-level snapshots and this functionality has
proven quite invaluable in my testing. Not only is it easy to create and reset snapshots, but the process is fast--at
least, it has been in my use cases. Unfortunately, I also work a lot with PostgreSQL (Postgres) and at the time of this writing,
such a snapshot-revert system does not exist. Supposedly the
[Point-in-Time Recovery](https://www.postgresql.org/docs/10/continuous-archiving.html) (PiTR) system can be used to
snapshot a database and then revert it, but this involves performing a full database restore and then replaying the
WAL files until the point the snapshot occurred. This can take quite a bit of time, especially if the database is large.
I searched to no avail for an open source tool or plugin that would accomplish this task, and eventually settled on a
method of using [Linux LVM](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)) to accomplish this task for
me.

# Background

In my testing, I started running Postgres inside Docker because it simplified my setup and deployment. Because I was
running Postgres this way, I started looking for Docker plugins that might allow snapshotting and resetting of
Docker volumes. My hope was that I could keep the Postgres data directory inside a Docker volume while keeping the
rest of the system in the main container.

My initial attempt was to try to use the [Convoy](https://github.com/rancher/convoy) plugin created by the Rancher
team. However, I could never get the behavior I desired.