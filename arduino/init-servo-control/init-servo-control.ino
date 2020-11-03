
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

bool isCmdProcessing = false;

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
    if (pos <= (panServoPos + panMaxRange) || pos >= (panServoPos - panMaxRange)) {
      // Serial.println("write pan");
      panServo.write(pos);
    }
  } else {
    if (pos <= (tiltServoPos + tiltMaxRange) || pos >= (tiltServoPos - tiltMaxRange)) {
      // Serial.println("write tilt");
      tiltServo.write(pos);
    }
  }

  isCmdProcessing = false;
}

// delayMs set to 0 due to base delay of 1s per servo motion
void sweep(String servo, int increment = 2, int delayMs = 1000) {
  bool isPanServo = servo == "pan";
  int sweepMin = isPanServo ? (panServoPos - panMaxRange) : (tiltServoPos - tiltMaxRange); // 30 is a coincidence
  int sweepMax = isPanServo ? (panServoPos + panMaxRange) : (tiltServoPos + tiltMaxRange);

  for (int i = sweepMin; i <= sweepMax; i = i + increment) {
    isCmdProcessing = true;

    servoWrite(servo, i);

    if (i > sweepMax) {
      servoWrite(servo, i);
    }

    // timeLoop(millis(), delayMs);
    delay(delayMs);
  }

  isCmdProcessing = false;
}

// these do need better names, not just incremental commands
void resetI2cVariables() {
  mainCmd = "";
  secondCmd = "";
  thirdCmd = "";
  fourthCmd = "";
}

void receiveEvent(int bytes) {
  if (isCmdProcessing) {
    return;
  }

  int loopCounter = 0;
  resetI2cVariables();

  // the reason these values are split is because
  // if I just join them into one big string, try to parse/access by array
  // the values aren't correct
  while (Wire.available()) {
    char c = Wire.read();

    if (loopCounter == 1) {
      mainCmd = c;
    }

    if (loopCounter > 1 and loopCounter < 5) { // eg. p179 or t179
      secondCmd += c; // 001 for increment 1
    }

    if (loopCounter == 5) { // eg. s179t || s179p
      thirdCmd = c;
    }

    if (loopCounter > 5 && loopCounter <= 9) { // eg. s179t1000... what about 0.5 or 10000 (10 seconds)
      fourthCmd += c;
    }

    loopCounter++;
  }
}

void loop() {
  // this is all ugly but still in prototype stage
  if (mainCmd == "p") {
    isCmdProcessing = true;
    servoWrite("pan", secondCmd.toInt());
    delay(1000); // no position feedback
  }
  
  if (mainCmd == "t") {
    isCmdProcessing = true;
    servoWrite("tilt", secondCmd.toInt());
    delay(1000); // no position feedback
  }

  if (mainCmd == "s") {
    if (thirdCmd == "p") {
      sweep("pan", secondCmd.toInt(), fourthCmd.toInt());
    } else {
      sweep("tilt", secondCmd.toInt(), fourthCmd.toInt());
    }

    // recenter
    isCmdProcessing = true;
    servoWrite("pan", panServoPos);
    isCmdProcessing = true;
    servoWrite("tilt", tiltServoPos);
  }

  resetI2cVariables();
  delay(100);
}
