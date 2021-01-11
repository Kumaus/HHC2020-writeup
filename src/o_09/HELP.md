# How To Resize and Switch Terminal Panes:
You can use the key combinations ( Ctrl+B ↑ or ↓ ) to resize the terminals.
You can use the key combinations ( Ctrl+B o ) to switch terminal panes.
See tmuxcheatsheet.com for more details
# To Add An Additional Terminal Pane:
`/usr/bin/tmux split-window -hb`
# To exit a terminal pane simply type:
`exit`
# To Launch a webserver to serve-up files/folder in a local directory:
```
cd /my/directory/with/files
python3 -m http.server 80
```
# A Sample ARP pcap can be viewed at:
https://www.cloudshark.org/captures/d97c5b81b057
# A Sample DNS pcap can be viewed at:
https://www.cloudshark.org/captures/0320b9b57d35
# If Reading arp.pcap with tcpdump or tshark be sure to disable name
# resolution or it will stall when reading:
```
tshark -nnr arp.pcap
tcpdump -nnr arp.pcap
```