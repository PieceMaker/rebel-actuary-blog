---
title: Don't Forget GRUB
date: 2020-04-23T12:00:00
layout: page
---

Last December, with the end of Windows 7 fast approaching I decided it was finally time to upgrade to
Windows 10. However, when I upgraded I decided to experiment some. I had been doing a lot of programming in my spare
time and really enjoyed the Linux environment. Package managers made life so nice and I found myself enjoying Windows
less and less. Basically, the only thing keeping me on Windows was video games.

Before this upgrade, I had read a lot about Steam's Linux support and how much gaming in Linux had progressed in the
past several years. I decided it was time to test Linux gaming first-hand and, if it held up, go native Linux at home.
When I upgraded, I bought a 1TB SSD and assigned 750GB to Windows and 250GB to Linux. I chose
[Pop!_OS](https://system76.com/pop) as my Linux distro to test since it is based on Ubuntu and it seemed to streamline
gaming.

## Gaming in Pop!_OS

I was quite impressed at how simple it was to install Steam in Pop!_OS. It was as simple as opening the app store,
finding Steam, and clicking a button. All dependencies including Nvidia drivers were automatically handled. Next up
was installing games. I wanted to avoid re-downloading a game that was already installed on Windows, so I decided to
experiment. I backed up Counter-Strike: Global Offensive on Windows and saved it to an external hard drive. I then
booted into Pop!_OS and restored the game. To my excitement, Steam recognized most of the assets and just had to
download a couple hundred megabytes of files.

Once the game was up-to-date it was time to try it out! I launched the game, adjusted my settings, and joined a server.
There it was, Counter-Strike in Linux. It looked the same, it sounded the same, and it *mostly* felt the same. I say
"mostly" as the controls just seemed slightly off. The mouse didn't react quite as I expected, even after adjusting
sensitivity, and the keyboard controls felt ever-so-slightly sluggish. There were also occasional framerate issues
that caused jumpiness and felt like slight lag spikes.

## Reclaiming Space

Overall, the Linux implementation was very impressive but seemed like it was only 90-95% of a Windows implementation.
Additionally, WSL proved to be much nicer than expected and was making Windows development enjoyable again. This
experiment was over and Windows had won. It was time to reclaim the 250GB of space that was allocated to Linux.

I loaded the Windows Disk Management tool, deleted the 250GB partition, and resized the Windows partition to reclaim
the space. There was nothing I needed to keep from the Linux OS and I told myself that increasing the size of a
partition couldn't possibly go wrong. Later that day I rebooted my box and was rudely presented with the following
message:

<highlight-code lang="bash">
error: no such partition
Entering rescue mode...
grub rescue>
</highlight-code>

Uh oh, I forgot that Grub was handling the dual-boot and lived on the Linux partition. What to do?

A quick Google search resulted in
[an article](https://www.partitionwizard.com/partitionmagic/error-no-such-partition.html) that covers just this issue.
It looks like the Windows 10 media will fix this and, thanks to procrastination, I still hadn't formatted my Windows 10
flash drive! The following four commands should fix this:

<highlight-code lang="bash">
bootrec /fixmbr
bootrec /fixboot
bootrec /scanos
bootrec /rebuildbcd
</highlight-code>

Unfortunately, after running `bootrec /fixboot` I received the error `Access is denied`. It turns out this is a common
error. Great... After more searching, I found a Stack Exchange [answer](https://superuser.com/a/1303238) that suggested
using `bcdboot C:\Windows`. Running this produced the error `Failure when attempting to copy boot files.` Rereading the
Stack Exchange answer, I saw I needed to use diskpart. Thanks to
[this article](https://macrorit.com/partition-magic-manager/set-active-partition-diskpart-command-line.html), I found
the following commands:

<highlight-code lang="bash">
diskpart
list disk
select disk ###
list partition
select partition ###
active
</highlight-code>

Rerunning `bcdboot C:\Windows` returned `Boot files successfully created.` Rebooting the system confirmed that the
Windows 10 installation had been salvaged.