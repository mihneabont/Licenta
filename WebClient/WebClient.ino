#include <Ethernet.h>
    #include <SPI.h>
    #include <MFRC522.h>

    #define RST_PIN         5
    #define SS_PIN          53      
 
    byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
    String tokenAparat = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGFyYXQiOiJhcGFyYXQiLCJpYXQiOjE1OTI0NzI4NzJ9.ErUOam1WGTNNSjje7MghPX-c9YucgBbiA78xOzHSsps";
    IPAddress server(74,125,232,128);
    IPAddress ip(192, 168, 0, 177);
    IPAddress myDns(192, 168, 1, 1);
    byte gateway[] = { 192,168,1,1 };
    MFRC522 mfrc522(SS_PIN, RST_PIN);
    EthernetClient client;
    String temp= "";
    bool sent = false; 
    bool executed = false;

    void setup()
    {
    Serial.begin(9600);
      while (!Serial);    // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)
  SPI.begin();      // Init SPI bus
  mfrc522.PCD_Init();   // Init MFRC522
  delay(4);       // Optional delay. Some board do need more time after init to be ready, see Readme
  mfrc522.PCD_DumpVersionToSerial();  // Show details of PCD - MFRC522 Card Reader details
     Serial.println("Initialize Ethernet with DHCP:");
    if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // Check for Ethernet hardware present
    if (Ethernet.hardwareStatus() == EthernetNoHardware) {
      Serial.println("Ethernet shield was not found.  Sorry, can't run without hardware. :(");
      while (true) {
        delay(1); // do nothing, no point running without Ethernet hardware
      }
    }
    if (Ethernet.linkStatus() == LinkOFF) {
      Serial.println("Ethernet cable is not connected.");
    }
    // try to congifure using IP address instead of DHCP:
    Ethernet.begin(mac, ip, myDns);
  } else {
    Serial.print("  DHCP assigned IP ");
    Serial.println(Ethernet.localIP());
  }
  Serial.println(F("Puteti incepe scanarea..."));
    delay(1000);
    delay(1000);
    }

    void loop()                                           
    {

   if ( mfrc522.PICC_IsNewCardPresent()) {    
  if ( mfrc522.PICC_ReadCardSerial()) {
    String userid;
for (byte i = 0; i < mfrc522.uid.size; i++) {
  userid += String(mfrc522.uid.uidByte[i], HEX);
}
userid.toUpperCase();
temp+= "codCartela=";
temp += userid;
Serial.println(userid);
         if (client.connect("192.168.1.141",3000)) {
     Serial.println("Sending to Server: ");                 
    client.println("POST /api/aparate/ HTTP/1.1");           
    Serial.println("POST /api/aparate/ HTTP/1.1");           
    client.println("Host: 192.168.1.141");
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.println("Authorization: " + tokenAparat);
    client.println("Connection: close");
    client.println("User-Agent: Arduino/1.0");
    client.print("Content-Length: ");
    client.println(temp.length());
    Serial.println(temp.length());
    client.println();
    client.print(temp);
    Serial.print(temp);
    client.println();
    mfrc522.PICC_HaltA();   
     } 
  }

    executed = true;
  }      
else {  
  if (executed) {
    temp = "";
    executed = false;
  }
}                                  

    }
