
// The I2C part of this code is based on this tutorial:
// https://dronebotworkshop.com/i2c-arduino-raspberry-pi/
// laughably struggled with simple string split
// https://forum.arduino.cc/index.php?topic=155667.0

#include <Wire.h>
#include <Servo.h>

Servo tiltServo;
Servo panServo;

int panServoPos = 104;
int panMaxRange = 30;
int tiltServoPos = 89;
int tiltMaxRange = 30;

String mainCmd = "";
String secondCmd = "";
String thirdCmd = "";
String fourthCmd = "";

void setup() {
  Serial.begin(9600);
  Wire.begin(0x8);
  Wire.onReceive(receiveEvent);
  panServo.attach(2);
  tiltServo.attach(3);
  panServo.write(panServoPos);
  tiltServo.write(tiltServoPos);
}

// makes sure max range not exceeded
void servoWrite(String servo, int pos) {
  if (servo == "pan") {
    if (pos <= panServoPos + panMaxRange || pos >= panServoPos - panMaxRange) {
      panServo.write(pos);
      Serial.println("pan servo");
      Serial.print(pos);
    }
  } else {
    if (pos <= tiltServoPos + tiltMaxRange || pos >= tiltServoPos - tiltMaxRange) {
      tiltServo.write(pos);
      Serial.println("tilt servo");
      Serial.print(pos);
    }
  }

  Serial.println("");
}

void sweep(String servo, int increment = 2, int delayMs = 1000) {
  Serial.println("sweep delay");
  Serial.print(delayMs);
  bool panServo = servo == "pan";
  int sweepMin = panServo ? panServoPos - panMaxRange : tiltServoPos - tiltMaxRange; // 30 is a coincidence
  int sweepMax = panServo ? panServoPos + panMaxRange : tiltServoPos + tiltMaxRange;

  for (int i = sweepMin; i <= sweepMax; i = i + increment) {
    servoWrite(servo, i);

    if (i > sweepMax) {
      servoWrite(servo, i);
    }

    Serial.println("for delay");
    delay(delayMs);
  }
}

void receiveEvent(int bytes) {
  String fullCommand = "";
  int loopCounter = 0;
  mainCmd = "";
  secondCmd = "";
  thirdCmd = "";
  fourthCmd = "";
  
  // the reason these values are split is because
  // if I just join them into one big string, try to parse/access by array
  // the values aren't correct
  Serial.println("receiving");
  while (Wire.available()) {
    char c = Wire.read();

    Serial.print(c);

    if (loopCounter == 1) {
      mainCmd = c;
    }

    if (loopCounter > 1 and loopCounter < 5) { // eg. p179 or t179
      secondCmd += c; // 001 for increment 1
    }

    if (loopCounter == 5) { // eg. s179t || s179p
      thirdCmd = c;
    }

    if (loopCounter > 5) { // eg. s179t1000... what about 0.5 or 10000 (10 seconds)
      fourthCmd += c;
    }

    loopCounter++;
  }

  Serial.println("");

  if (mainCmd == "p") {
    servoWrite("pan", secondCmd.toInt());
  }
  
  if (mainCmd == "t") {
    servoWrite("tilt", secondCmd.toInt());
  }

  if (mainCmd == "s") {
    if (thirdCmd == "p") {
      sweep("pan", secondCmd.toInt(), fourthCmd.toInt());
    } else {
      sweep("tilt", secondCmd.toInt(), fourthCmd.toInt());
    }
  }
}

void loop() {
  delay(100);
}
