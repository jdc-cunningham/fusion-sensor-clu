
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

String moveServo = ""; // p or t for pan/tilt
String moveServoPos = ""; // 0-180 casted to int

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
    }
  } else {
    if (pos <= tiltServoPos + tiltMaxRange || pos >= tiltServoPos - tiltMaxRange) {
      tiltServo.write(pos);
    }
  }
}

void sweep(String servo, int increment = 2, int delayMs = 1000) {
  bool panServo = servo == "pan";
  int sweepMin = panServo ? panServoPos - panMaxRange : tiltServoPos - tiltMaxRange; // 30 is a coincidence
  int sweepMax = panServo ? panServoPos + panMaxRange : tiltServoPos + tiltMaxRange;

  for (int i = sweepMin; i <= sweepMax; i += increment) {
    servoWrite(servo, i);

    if (i > sweepMax) {
      servoWrite(servo, i);
    }
    delay(delayMs);
  }
}

void receiveEvent(int bytes) {
  String fullCommand = "";
  int loopCounter = 0;
  moveServo = "";
  moveServoPos = "";
  
  while (Wire.available()) {
    char c = Wire.read();

    if (loopCounter == 1) {
      moveServo = c;
    }

    if (loopCounter > 1 and loopCounter < 5) {
      moveServoPos += c;
    }

    loopCounter++;
  }

  if (moveServo == "p") {
    panServo.write(moveServoPos.toInt());
  }
  
  if (moveServo == "t") {
    tiltServo.write(moveServoPos.toInt());
  }
}

void loop() {
  delay(100);
}
