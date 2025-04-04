import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Chat.css";

export const Chat = ({
  isSpeaking,
  showVideo,
  isInteracting,
  setIsSpeaking,
  setShowVideo,
  setVideoId,
  setShowImage,
  setImageUrls,
  userName,
}) => {
  // State declarations
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isStructuredMode, setIsStructuredMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentGuideSteps, setCurrentGuideSteps] = useState(null); // New state for dynamic guide steps
  const [activeFailureCode, setActiveFailureCode] = useState(null);
  const recognitionRef = useRef(null);
  const contentRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  // General guide steps (unchanged)
  const guideSteps = {
    "pickup_position_error": [
      { description: "Step 1: Go to Home Page", imageUrl: "/images/Error1/Slide1.JPG" },
      { description: "Step 2: Select the Arrange - ArrIndic", imageUrl: "/images/Error1/Slide2.JPG" },
      { description: "Step 3: Go to Arrange-parts Prepare Nozzle", imageUrl: "/images/Error1/Slide3.JPG" },
      { description: "Step 4: Select the option Feeder", imageUrl: "/images/Error1/Slide4.JPG" },
      { description: "Step 5: Select the pickup position", imageUrl: "/images/Error1/Slide5.JPG" },
      { description: "Step 6: Feeder list will be shown on the screen", imageUrl: "/images/Error1/Slide6.JPG" },
      { description: "Step 7: Select the feeder location which have the pickup position error", imageUrl: "/images/Error1/Slide7.JPG" },
      { description: "Step 8: Click on Teach Start", imageUrl: "/images/Error1/Slide8.JPG" },
      { description: "Step 9: Teaching Window will be shown on the screen", imageUrl: "/images/Error1/Slide9.JPG" },
      { description: "Step 10: Adjust The X-Y OFFSET Manually Check the Offset and fix the component to its place using the X-Y Co-ordinate. Feed the offset for 2 to 3 times.", imageUrl: "/images/Error1/Slide10.JPG" },
      { description: "Step 11: Click on the Manual set to fix the offset", imageUrl: "/images/Error1/Slide11.JPG" },
      { description: "Step 12: Save option will appear, click Yes to save the Changes", imageUrl: "/images/Error1/Slide12.JPG" },
      { description: "Step 13: Go to home page again", imageUrl: "/images/Error1/Slide13.JPG" },
      { description: "Step 14: Select the Arrange - ArrIndic", imageUrl: "/images/Error1/Slide14.JPG" },
      { description: "Step 15: Go to Arrange-parts Prepare Nozzle", imageUrl: "/images/Error1/Slide15.jpeg" },
      { description: "Step 16: Select the TBL14", imageUrl: "/images/Error1/Slide16.JPG" },
      { description: "Step 17: Click on Nozzle check", imageUrl: "/images/Error1/Slide17.JPG" },
    ],
    "bom": [ 
      { description: "Step 1: Connect to the VPN to ensure secure access to the system." },
      { description: "Step 2: Open Windchill and log in using your credentials." },
      { description: "Step 3: Navigate to the 'Task' section within Windchill." },
      { description: "Step 4: Apply the filter to narrow down the relevant tasks." },
      { description: "Step 5: Click on 'Acknowledgement' to access specific content." },
      { description: "Step 6: Select the required content and download the Excel sheet." },
      { description: "Step 7: Return to the 'Task' section and apply the filter again." },
      { description: "Step 8: Click on the second ECN number and download another Excel sheet." },
      { description: "Step 9: Publish the downloaded files to the department for review or further processing." },
      { description: "Step 10: Merge all files for the day into a single document and create an MM file." },
      { description: "Step 11: Send an email with the MM file to Pankaj for further actions." },
      { description: "Step 12: Send an email with relevant details to Rashe Shyam for updates." },
      { description: "Step 13: Send an email with necessary information to Rakesh for review or approval." },
      { description: "Step 14: From the three emails sent, take screenshots of approval responses from each recipient." },
      { description: "Step 15: Share screenshots of approval responses with Sapna for record-keeping or next steps." }
    ],
  };



  // New troubleshooting data structure
  const troubleshootingData = {
    "ant_5_fail": [
      { description: "Step 1: Start the rework process for the Main Logic Board (MLB)", imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 2: Scan all MLBs to identify the component", imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 3: Sort the MLB: Identify if it is M391_H02 or M391_A03", imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 4: Perform Visual Inspection (VI) by CCD only", imageUrl: "/images/ant5fail/step4.jpg" },
      { description: "Step 5: Check VI result: If VI passes, move to kitting and end the process", imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 6: If VI fails, proceed to rework: For M391_H02, rework 7 times (7X) on both TOP and BOT sides; for M391_A03, rework 4 times (4X) on both TOP and BOT sides", imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 7: Perform rework at the specified rework location", imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 8: Conduct a debug BLT test on all stations", imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 9: Check debug test result: If the test passes, capture the fixture pass log, move to kitting, and end the process", imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 10: If the debug test fails, move to the Test Review Center (TRC)", imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 11: Follow Work Instruction (WI) TRC to complete the process", imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 12: End the rework process", imageUrl: "/images/ant5fail/1.jpeg" },
    ],
    "rado_bt_nsft": [  
      { description: "Step 1: Confirm the symptom: PCBA fail at RFT Stage matches the report", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 2: Perform FA step 1: Confirm that the PCBA failed at the RFT stage", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 3: Perform FA step 2: Conduct visual CCD inspection and identify abnormality at location U4812 (component reverse)", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 4: Perform FA step 3: Check SPI and confirm no abnormality is found" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 5: Perform FA step 4: Check Pre AOI and identify abnormality at location U4812", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 6: Perform FA step 5: Check Pre AOI board image and confirm abnormality is found", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 7: Perform FA step 6: Check Pre AOI data, note that the defect was detected the first time, operator worked on the specific location, but the second time AOI did not detect the problem", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 8: Perform FA step 7: Check Post AOI and confirm no abnormality is found" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 9: Perform FA step 8: TRC person remounts at U4812, then confirm that the PCBA passed", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 10: Identify the root cause: Component reverse at location U4812" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 11: Note the corrective action: [Corrective action not specified in the document]" , imageUrl: "/images/ant5fail/1.jpeg" }
    ],
    "rado_nr_cal_fail": [
      { description: "Step 1: Confirm the symptom: PCBA fail at CAL Stage matches the report" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 2: Perform FA step 1: Confirm that the PCBA failed at the CAL stage", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 3: Perform FA step 2: Conduct visual CCD inspection and identify abnormality at location Con5501", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 4: Perform FA step 3: Check SPI and confirm no abnormality is found" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 5: Perform FA step 4: Check Pre AOI and identify abnormality at location CON5501" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 6: Perform FA step 5: Check Pre AOI board image and identify abnormality in the coupler" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 7: Perform FA step 6: After remount at Con5501, confirm that the PCBA passed" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 8: Identify the root cause: Coupler shift at location Con5501" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 9: Note the corrective action: [Corrective action not specified in the document]", imageUrl: "/images/ant5fail/1.jpeg"  }
    ],
    "rado_nr_cal": [
      { description: "Step 1: Confirm the symptom: PCBA fail at CAL Stage matches the report", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 2: Perform FA step 1: Confirm that the PCBA failed at the CAL stage", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 3: Perform FA step 2: Check SPI and confirm it is OK" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 4: Perform FA step 3: Check Pre AOI result and confirm no abnormality at the location" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 5: Perform FA step 4: Check Pre AOI board image and confirm no abnormality at locations L5400 and R5400", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 6: Perform FA step 5: Check Post AOI result and confirm it is OK" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 7: Perform FA step 6: After remount, confirm that the PCBA passed" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 8: Identify the root cause: Short at locations R5400 and L5400", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 9: Note the corrective action: Mounter gap has been changed from 0.300 to 0.250" , imageUrl: "/images/ant5fail/1.jpeg" },
    ],
    "rado_odm_fail": [
      { description: "Step 1: Confirm the symptom: PCBA fail at DBC Stage matches the report" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 2: Perform FA step 1: Confirm that the PCBA failed at the DBC stage", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 3: Perform FA step 2: Conduct visual inspection and identify abnormality at location C1224" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 4: Perform FA step 3: Check SPI and confirm it is OK" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 5: Perform FA step 4: Check Pre AOI result and confirm no abnormality at location C1224", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 6: Perform FA step 5: Check Pre AOI board image and identify abnormality (C1224 shift in 36104)" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 7: Perform FA step 6: Check Post AOI result and confirm it is OK", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 8: Perform FA step 7: After remount, confirm that the PCBA passed", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 9: Identify the root cause: Shift at location C1224" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 10: Note the corrective action: Position has been changed from 0.000 to 0.010 in x direction", imageUrl: "/images/ant5fail/1.jpeg"  },
    ],
    "rado_lte_cal_mtk": [
      { description: "Step 1: Confirm the symptom: PCBA fail at CAL Stage" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 2: Perform FA step 1: PCBA got Failed At CAL stage", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 3: Perform FA step 2: Visual inspection done, found abnormality at location C5023", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 4: Perform FA step 3: Checked SPI found OK" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 5: Perform FA step 4: Checked PRE-AOI found no abnormality at this location" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 6: Perform FA step 5: Checked PRE AOI board image found no abnormality at this location" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 7: Perform FA step 6: Checked POST AOI Result found OK", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 8: Perform FA step 7: After that Remount, PCBA got passed", imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Root Cause: Shift , C5023" , imageUrl: "/images/ant5fail/1.jpeg" },
    ], 
    "rado_nr_cal_mtk": [
      { description: "Step 1: Confirm the symptom: PCBA fail at CAL Stage", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 2: Perform FA step 1: PCBA got Failed At CAL stage", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 3: Perform FA step 2: Visual inspection done , found abnormality at location C5223/C5228", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 4: Perform FA step 3: Checked SPI found OK", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 5: Perform FA step 4: Checked PRE-AOI found no abnormality at this location", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 6: Perform FA step 5: Checked PRE AOI board image found no abnormality at this location", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 7: Perform FA step 6: Checked POST AOI Result found OK as these components are under the shield" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 8: Perform FA step 7: After that Remount, PCBA got passed" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Root Cause: Shift , C5223/C5228", imageUrl: "/images/ant5fail/1.jpeg"  },
    ],
    "rado_lte_cal": [
      { description: "Step 1: Confirm the symptom: PCBA fail at CAL Stage" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 2: Perform FA step 1: PCBA got Failed At CAL Stage", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 3: Perform FA step 2: Checked SPI found OK", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 4: Perform FA step 3: Checked PRE-AOI found abnormality at this location as U4600 has thrown up", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 5: Perform FA step 4: Checked PRE AOI board image found abnormality at this location while repairing the board at Pre-AOI, Operator has not placed the component properly which resulted in shift", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 6: Perform FA step 5: Checked POST AOI Result found OK because it is under the shield" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 7: Perform FA step 6: After that Remount, PCBA got passed" , imageUrl: "/images/ant5fail/1.jpeg" },
       ],
    "rado_odm": [
      { description: "Step 1: Confirm the symptom: PCBA fail at DBC Stage , ODM FAIL", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 2: Perform FA step 1: PCBA got Failed At DBC stage", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 3: Perform FA step 2: Visual inspection done , found abnormality at location U1801", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 4: Perform FA step 3: Checked SPI found OK", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 5: Perform FA step 4: Checked PRE-AOI found OK", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 6: Perform FA step 5: Checked PRE AOI board image found abnormality at this location U1801 as it was damaged", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Step 7: Perform FA step 6: Checked POST AOI Result found OK" , imageUrl: "/images/ant5fail/1.jpeg" },
      { description: "Step 8: Perform FA step 7: After that POST AOI the part, PCBA got passed", imageUrl: "/images/ant5fail/1.jpeg"  },
      { description: "Root Cause: Damage , U1801" , imageUrl: "/images/ant5fail/1.jpeg" },
    ],
    "al5_odm_fail": [
      { description: "Step 1: Confirm the symptom: PCBA fail at DBC Stage" },
      { description: "Step 2: Perform FA step 1: Conduct visual inspection & x-ray found OK" },
      { description: "Step 3: Perform FA step 2: Check CCD found OK" },
      { description: "Step 4: Perform FA step 3: PCBA Handed over to TRC" },
      { description: "Step 5: Perform FA step 4: Check SPI – Found abnormality (BOT Fail – insufficient solder at location C5006)" },
      { description: "Step 6: Perform FA step 5: Check Pre AOI – Found abnormality (TOP Pass – locations SPR3206, U2901)" },
      { description: "Step 7: Perform FA step 6: Check post AOI – Found no abnormalities" },
      { description: "Step 8: Perform FA step 7: TRC person checked impedance of all components – Found low impedance at location U1001" },
      { description: "Step 9: Perform FA step 8: TRC person reflow U1001 Component but PCBA not pass" },
      { description: "Step 10: Perform FA step 9: TRC person remount at location U1001 – PCBA not pass" },
      { description: "Step 11: Perform FA step 10: Remove shield and then check PCBA" },
      { description: "Step 12: Perform FA step 11: Check golden pad at location U2901" },
      { description: "Root Cause 1: Low impedance at location U1001" },
      { description: "Root Cause 2: Golden pad at location U2901" }
    ],
    "al5_lte_cal_fail": [
      { description: "Step 1: Confirm the symptom: PCBA fail at CAL Stage matches the report" },
      { description: "Step 2: Perform FA step 1: Conduct visual inspection and x-ray to identify abnormalities" },
      { description: "Step 3: Perform FA step 2: Note that the PCBA failed at the CAL stage" },
      { description: "Step 4: Perform FA step 3: Check CCD and identify golden pad at location C4954" },
      { description: "Step 5: Perform FA step 4: Check SPI and identify abnormality (BOT Fail – insufficient solder at location C5006)" },
      { description: "Step 6: Perform FA step 5: Check Pre AOI and identify abnormality (TOP Pass – locations SPR3206, U2901)" },
      { description: "Step 7: Perform FA step 6: Check post AOI and confirm no abnormalities are found" },
      { description: "Step 8: Perform FA step 7: Check board image of Pre AOI and confirm no abnormalities are found" },
      { description: "Step 9: Identify the root cause: Golden pad at location C4954" },
      { description: "Step 10: Note the corrective action: Provide training to operator and inform ME leader to monitor skill level, ensure repair board operator sends for x-ray then passes to BLT, and ensure Quality validates the line process" }
    ],
    "al5_ant3_fail": [
      { description: "Step 1: Confirm the symptom: PCBA fail at ANT Testing Stage in FATP matches the report" },
      { description: "Step 2: Perform FA step 1: Note that the PCBA failed at the ANT Testing Stage in FATP" },
      { description: "Step 3: Perform FA step 2: Visually inspect and identify abnormality in Components Damage Inside UV glue and UV Glue on Antenna" },
      { description: "Step 4: Perform FA step 3: Hand over to TRC, then re-test the PCBA and confirm it passes" },
      { description: "Step 5: Perform FA step 4: Check SPI and confirm no abnormality is found" },
      { description: "Step 6: Perform FA step 5: Check Pre AOI and confirm no abnormality is found" },
      { description: "Step 7: Identify the root cause: Inside UV glue and UV Glue on Antenna" },
      { description: "Step 8: Note the corrective action: Provide feedback to BLT Team, provide feedback to glue Team, and ensure Quality validates the line process" }
    ],
    "al5_gsm_cal_mtk": [
      { description: "Step 1: Confirm the symptom: PCBA fail at CAL Stage matches the report" },
      { description: "Step 2: Perform FA step 1: Note that the PCBA failed at the CAL stage" },
      { description: "Step 3: Perform FA step 2: Check CCD image and identify abnormality at location U4705" },
      { description: "Step 4: Perform FA step 3: Check SPI result and confirm it is OK" },
      { description: "Step 5: Perform FA step 4: Check PRE-AOI result and identify abnormality at location U4705" },
      { description: "Step 6: Perform FA step 5: Review PRE-AOI board image and confirm abnormality at location U4705" },
      { description: "Step 7: Perform FA step 6: TRC person to remount at location U4705" },
      { description: "Step 8: Perform FA step 7: Confirm the PCBA passes after remount" },
      { description: "Step 9: Identify the root cause: Found part shift at location U4705" },
      { description: "Step 10: Note the corrective action: Provide training to operators and keep monitoring" }
    ],
    "al5_lte_cal_mtk": [
      { description: "Step 1: Confirm the symptom: PCBA fail at DBC Stage matches the report" },
      { description: "Step 2: Perform FA step 1: Note that the PCBA failed at the DBC stage" },
      { description: "Step 3: Perform FA step 2: Conduct a visual inspection and identify abnormality at location U2901" },
      { description: "Step 4: Perform FA step 3: Check SPI and confirm no abnormality is found" },
      { description: "Step 5: Perform FA step 4: Check PRE-AOI and confirm no abnormality is found" },
      { description: "Step 6: Perform FA step 5: Review PRE-AOI board image and confirm abnormality at location U2901 as wrong part mounted" },
      { description: "Step 7: Perform FA step 6: Check POST AOI and confirm the result is OK" },
      { description: "Step 8: Perform FA step 7: Replace the part and confirm the PCBA passes" },
      { description: "Step 9: Identify the root cause: Wrong part mounted – U2901" },
      { description: "Step 10: Note the corrective action: Keep monitoring in mass production" }
    ],
    "al5_nr_nsft": [
      { description: "Step 1: Confirm the symptom: PCBA fail at RFT Stage matches the report" },
      { description: "Step 2: Perform FA step 1: Note that the PCBA failed at the RFT stage" },
      { description: "Step 3: Perform FA step 2: Check CCD image and identify abnormality at location C5011" },
      { description: "Step 4: Perform FA step 3: Check SPI result and confirm it is OK" },
      { description: "Step 5: Perform FA step 4: Check PRE-AOI result and confirm no abnormality at location C5011" },
      { description: "Step 6: Perform FA step 5: Review PRE-AOI board image and confirm abnormality at location C5011" },
      { description: "Step 7: Perform FA step 6: TRC person to remount at location C5011" },
      { description: "Step 8: Perform FA step 7: Confirm the PCBA passes after remount" },
      { description: "Step 9: Identify the root cause: Found upside down at location C5011" },
      { description: "Step 10: Note the corrective action: Keep monitoring in mass production" }
    ],
    "al5_wifi_nsft": [
      { description: "Step 1: Confirm the symptom: PCBA fail at RFT Stage matches the report" },
      { description: "Step 2: Perform FA step 1: Note that the PCBA failed at the RFT stage" },
      { description: "Step 3: Perform FA step 2: Conduct a visual inspection and identify abnormality at location U5401" },
      { description: "Step 4: Perform FA step 3: Check SPI and confirm it is OK" },
      { description: "Step 5: Perform FA step 4: Check PRE-AOI and confirm it is OK" },
      { description: "Step 6: Perform FA step 5: Review PRE-AOI board image and confirm no abnormality at location U5401" },
      { description: "Step 7: Perform FA step 6: Check POST AOI and confirm the result is OK" },
      { description: "Step 8: Perform FA step 7: Remount the part and confirm the PCBA passes" },
      { description: "Step 9: Identify the root cause: Uplift – U5401" },
      { description: "Step 10: Note the corrective action: Keep monitoring in mass production" }
      
    ],
    "al5_lte_cal": [
      { description: "Step 1: Confirm the symptom: PCBA fail at CAL Stage matches the report" },
      { description: "Step 2: Perform FA step 1: Note that the PCBA failed at the CAL stage" },
      { description: "Step 3: Perform FA step 2: Conduct a visual inspection and identify abnormality at location U5401" },
      { description: "Step 4: Perform FA step 3: Check SPI and confirm it is OK" },
      { description: "Step 5: Perform FA step 4: Check PRE-AOI and confirm it is OK" },
      { description: "Step 6: Perform FA step 5: Review PRE-AOI board image and confirm no abnormality at location U5401" },
      { description: "Step 7: Perform FA step 6: Check POST AOI and confirm the result is OK" },
      { description: "Step 8: Perform FA step 7: Remount the part and confirm the PCBA passes" },
      { description: "Step 9: Identify the root cause: Uplift – C5208" },
      { description: "Step 10: Note the corrective action: Keep monitoring" }
    ],
    "wait_for_blan_network_device_arrival_1": [
      { description: "Step 1: Check in X Ray of that PCB and found shielded and component short at location SH3304 & C1806 (refer to Fig. 1)" },
      { description: "Step 2: Check SPI and found good data (refer to Fig. 2)" },
      { description: "Step 3: Check Pre-AOI and found no component issue at location C1806 (refer to Fig. 3)" },
      { description: "Step 4: Check Post AOI and found shield shifting issue at location SH3304 (refer to Fig. 4)" },
      { description: "Step 5: Move the feeder location from bottom to top side for shield SH3304 and give offset in y-axis 0.30 on component at location C1806 (refer to Fig. 4)" },
      { description: "Step 6: Send 10 panels for X-ray and found result good (refer to Fig. 5)" },
      { description: "Root Cause: Shield shifting at location SH3304" },
      { description: "Improvement Action: Arrange one PE & Quality person to take follow up and send 05 panels on an hourly basis for X-ray" }
    ],
    "Rx_SC_Cal_LTE_B71_DlF617000_Rout38_RFRout133129_Cark0_4_CalIdx31_Step0_FE14_FELG2_Ant1_HPM_PathLoss": [
      { description: "Step 1: Confirm the symptom: PCBA failure at BRD stage with 1.15% (706 pcs) fail rate, model KANSAS25_NA_SUPER/MB, location FL6904 (PN: S983E40305)" },
      { description: "Step 2: Perform FA step 1: Analyze material and confirm it is bad (TRC analysis)" },
      { description: "Step 3: Perform FA step 2: Conduct swap test with NG material on ok PCBA, confirming the same failure" },
      { description: "Step 4: Perform FA step 3: Note the lack of substitute material and identify different Date Codes" },
      { description: "Step 5: Perform FA step 4: Test different Date Codes and identify NG Date Code (DC-20241005)" },
      { description: "Step 6: Perform FA step 5: Verify line stability with DC-2024103, confirming no further issues" },
      { description: "Step 7: Identify the root cause: PCBA failure due to bad material at location FL6904 (NG Date Code DC-20241005)" },
      { description: "Step 8: Note the improvement action: Use DC-2024103 on the line with no issues, provide feedback to IQC team, and validate with PE team through swap tests in TRC" }
    ],
    "MTK_SP_FLASH_TOOL_V6_IFLASH_01": [
      { description: "Step 1: Confirm the symptom: PCBA failure at IFLASH stage with 0.58% (355 pcs) fail rate, model KANSAS_5G, location Shorting (U2000)" },
      { description: "Step 2: Perform FA step 1: According to X-ray there is Bridging issue." },
      { description: "Step 3: Perform FA step 2: Check SPI data found there was no any abnormal from Printer side placement." },
      { description: "Step 4: Perform FA step 3: When we check Mounted PCB before Reflow in X-ray then found only one array in shifting issue and same PCBA array failed at BLT stage." },
      { description: "Step 5: Perform FA step 4: So first we teach mounting placement from mounter and also teach BGA ball pad to pad." },
      { description: "Step 6: Perform FA step 5: In-process Pre-AOI detection Level at Line for detection Miner shifting at Pre-AOI." },
      { description: "Step 7: Perform FA step 6: After teach both stage Mounting and AOI then take trail with 5 panel result is Ok, then allow for mask production, now running ok." },
      { description: "Step 8: Identify the root cause: These U2000 is BGA IC component. This issue was occurrence due to mounting placement issue came in only one array. There is shifting issue came in single array. Due to Bridging issue came in array only after Reflow." },
      { description: "Step 9: Note the improvement action: First Teach this component (U2000) PAD for all array from mounter. For AOI detection also increase to 100 to 77. Remark Different on PCBA for identification after improvement PCBA. After improvement check X-ray every hour 10 panel." }
    ],


    // Add more error codes here in the future, e.g.,
    // "another_error_code": [
    //   { description: "Step 1: ...", imageUrl: "/images/another/step1.jpg" },
    //   // ...
    // ]
  };
  // Existing failure data (unchanged)
  const failureData = {
    "mtk_sp_flash_tool_v6_iflash_01": {
      rootCause: {
        text: "1. These U2000 is BGA IC component. 2. This issue was occurrence due to mounting placement issue came in only one Array. 3. There is shifting issue came in single array. Due to Bridging issue came in 4 no.array only after Reflow.",
        images: ["/images/failure1/rootcause1.png", "/images/failure1/rootcause3.png"],
      },
      contaminationAction: {
        text: "1. According to X-ray there is Bridging issue. 2. Check SPI data found there was no any abnormal from Printer side placement. 3. When we check Mountined PCB before Reflow in X-ray then found only one arrnay in shfiting issue and same PCBA array Failed at BLT stage. 4. So first we Teach mounting placement from mounter and also teach BGA Ball pad to pad. 5. Incresses Pre-AOI detection Level at Line for detection Miner shfiting at Pre-AOI. 6. After Teach Both stage Mounting and AOI then take trail with 5 panel. Result is ok. Then allow for mask production. Now running ok.",
        images: ["/images/failure1/rootcause1.png", "/images/failure1/rootcause3.png"],
      },
      improvementAction: {
        text: "1. First Teach this component (U2000) PAD for all array from mounter. 2. For AOI detection also increase 100 to 77. 3. Remark Different on PCBA for identification after improvemnt PCBA. 4. After improvement check x-ray every hour 10*panel.",
        images: ["/images/failure1/rootcause1.png", "/images/failure1/rootcause3.png"],
      },

    },
    // Add more failure codes as needed
  };

  // useEffect hooks (unchanged)
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      const neerjaVoice =
        availableVoices.find((voice) =>
          voice.name === "Microsoft Neerja Online (Natural) - English (India) (Preview)"
        ) || availableVoices[0];
      if (neerjaVoice) setSelectedVoice(neerjaVoice);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (userName && chatHistory.length === 0) {
      const welcomeMessage = `Welcome, It is my great honor and privilege to welcome our esteemed ${userName}, to this special demonstration of our Center of Excellence (COE) powered by AI. We Welcome you to our Grand Inaguration. At Padget, we take immense pride in our journey—from being a key player in the Make in India initiative to becoming a recognized leader in mobile production. With cutting-edge technology, a dedicated team, and a relentless pursuit of quality, we have built a strong foundation for the future. Today’s visit is a special occasion as we showcase our state-of-the-art product gallery, our roadmap for innovation, and the milestones that define our success. Your guidance and leadership continue to inspire us as we strive for greater efficiency, sustainability, and global expansion.`;
      setChatHistory([{ bot: welcomeMessage }]);
      speak(welcomeMessage);
    }
  }, [userName]);

  // Speech recognition functions (unchanged)
  const startListening = () => {
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      setUserInput(finalTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (userInput.trim() !== "") handleSubmit(new Event("submit"));
    };

    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if (showVideo || !text) return;
    const synthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthesis.speak(utterance);
  };

  useEffect(() => {
    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].user) {
      const lastResponse = chatHistory[chatHistory.length - 1].bot;
      speak(lastResponse);
    }
  }, [chatHistory]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleUserInput = (e) => setUserInput(e.target.value);

  // Updated handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    const lowerInput = userInput.toLowerCase().trim();

    // Handle guide commands (general guide or troubleshooting)
    // if (lowerInput.startsWith("guide")) {
    //   setCurrentGuideSteps(guideSteps);
    //   setIsStructuredMode(true);
    //   setCurrentStepIndex(0);
    //   const firstStep = guideSteps[0];
    //   setChatHistory([...chatHistory, { user: userInput, bot: firstStep.description }]);
    //   setImageUrls([firstStep.imageUrl]);
    //   setShowImage(true);
    //   setUserInput("");
    //   return;
    // }

    let guide;
    if ((guide = lowerInput.match(/guide for (.+)/))) {
      const errorCodeRaw = guide[1].trim();
      const errorCode = errorCodeRaw.toLowerCase().replace(/\s+/g, '_');
      if (guideSteps[errorCode]) {
        setCurrentGuideSteps(guideSteps[errorCode]);
        setIsStructuredMode(true);
        setCurrentStepIndex(0);
        const firstStep = guideSteps[errorCode][0];
        setChatHistory([...chatHistory, { user: userInput, bot: firstStep.description }]);
        setImageUrls([firstStep.imageUrl]);
        setShowImage(true);
        setUserInput("");
        return;
      } else {
        setChatHistory([...chatHistory, { bot: "Sorry, I don't have guide steps for that process." }]);
        setUserInput("");
        return;
      }
    }





    let troubleshootMatch;
    if ((troubleshootMatch = lowerInput.match(/troubleshoot for (.+)/))) {
      const errorCodeRaw = troubleshootMatch[1].trim();
      const errorCode = errorCodeRaw.toLowerCase().replace(/\s+/g, '_');
      if (troubleshootingData[errorCode]) {
        setCurrentGuideSteps(troubleshootingData[errorCode]);
        setIsStructuredMode(true);
        setCurrentStepIndex(0);
        const firstStep = troubleshootingData[errorCode][0];
        setChatHistory([...chatHistory, { user: userInput, bot: firstStep.description }]);
        setImageUrls([firstStep.imageUrl]);
        setShowImage(true);
        setUserInput("");
        return;
      } else {
        setChatHistory([...chatHistory, { bot: "Sorry, I don't have troubleshooting steps for that error code." }]);
        setUserInput("");
        return;
      }
    }

    // Handle failure code
    const normalizedInput = userInput.trim().toLowerCase();
    if (failureData[normalizedInput]) {
      setActiveFailureCode(normalizedInput);
      setShowImage(true);
      const initialImages = failureData[normalizedInput].rootCause.images;
      setImageUrls(initialImages);
      const initialMessage = "You have entered a failure code. Please ask about root cause, contamination action, or improvement action.";
      setChatHistory([...chatHistory, { user: userInput, bot: initialMessage }]);
      setUserInput("");
      return;
    }

    // Handle failure code mode
    if (activeFailureCode) {
      let responseText = "";
      let images = [];
      if (lowerInput.includes("root cause")) {
        responseText = failureData[activeFailureCode].rootCause.text;
        images = failureData[activeFailureCode].rootCause.images;
      } else if (lowerInput.includes("contamination action")) {
        responseText = failureData[activeFailureCode].contaminationAction.text;
        images = failureData[activeFailureCode].contaminationAction.images;
      } else if (lowerInput.includes("improvement action")) {
        responseText = failureData[activeFailureCode].improvementAction.text;
        images = failureData[activeFailureCode].improvementAction.images;
      } else if (lowerInput.includes("exit") || lowerInput.includes("done")) {
        setActiveFailureCode(null);
        setShowImage(false);
        setImageUrls([]);
        responseText = "Exited failure code mode.";
      } else {
        responseText = "Please ask about root cause, contamination action, or improvement action, or type 'exit' to quit.";
      }
      if (responseText) {
        setChatHistory([...chatHistory, { user: userInput, bot: responseText }]);
        if (images.length > 0) {
          setImageUrls(images);
        }
        setUserInput("");
        return;
      }
    }

    // Handle structured mode for "yes" and "exit"
    if (isStructuredMode) {
      if (lowerInput === "yes") {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < currentGuideSteps.length) {
          setCurrentStepIndex(nextIndex);
          const nextStep = currentGuideSteps[nextIndex];
          setChatHistory([...chatHistory, { user: userInput, bot: nextStep.description }]);
          setImageUrls([nextStep.imageUrl]);
        } else {
          setChatHistory([...chatHistory, { user: userInput, bot: "Guide completed. Thank you!" }]);
          setIsStructuredMode(false);
          setShowImage(false);
          setImageUrls([]);
          setCurrentGuideSteps(null);
        }
        setUserInput("");
        return;
      } else if (lowerInput === "exit") {
        setChatHistory([...chatHistory, { user: userInput, bot: "Guide exited." }]);
        setIsStructuredMode(false);
        setShowImage(false);
        setImageUrls([]);
        setCurrentGuideSteps(null);
        setUserInput("");
        return;
      } else {
        setChatHistory([...chatHistory, { bot: "Please type 'Yes' to proceed or 'Exit' to quit." }]);
        setUserInput("");
        return;
      }
    }

    // Handle "next" command
    if (lowerInput === "next") {
      const smtMessage = "Here, we employ advanced automation to ensure precision in printed circuit board (PCB) assembly. Our process begins with the Solder Paste Printing Machine, which accurately applies solder paste to PCB pads, laying the foundation for robust connections. Next, the Pick and Place Machine swiftly and precisely positions electronic components onto the boards. Finally, our Automated Optical Inspection (AOI) system meticulously examines each assembly to detect and correct any defects, ensuring the highest quality standards";
      setChatHistory([...chatHistory, { user: userInput, bot: smtMessage }]);
      setUserInput("");
      return;
    }

    // Handle "introduce" command
    if (lowerInput.startsWith("introduce")) {
      const topic = lowerInput.replace("introduce", "").trim();
      const videoMapping = {
        "smt process": "6_8EqJXzpXo",
        "pick and place mounter": "M2V7sUfwxpY",
        "aoi": "cI7MyFLv6dA",
        "screen printer": "ylVXhrGE55c",
        "mounter": "MoukIPQa58Q",
      };
      for (const [key, id] of Object.entries(videoMapping)) {
        if (topic.includes(key)) {
          setVideoId(id);
          setShowVideo(true);
          setUserInput("");
          return;
        }
      }
    }

    // Default: Send to API
    setLoading(true);
    try {
      const response = await axios.post(
        "https://malini-backend.onrender.com/api/chatgpt",
        { message: userInput },
        { headers: { "Content-Type": "application/json" } }
      );
      const generatedText = response.data.response;
      setChatHistory([...chatHistory, { user: userInput, bot: generatedText }]);
      setUserInput("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChatVisibility = () => setIsChatOpen(!isChatOpen);

  const handleClearChatHistory = () => {
    setChatHistory([]);
    setUserInput("");
    setActiveFailureCode(null);
    setShowImage(false);
    setImageUrls([]);
    setIsStructuredMode(false);
    setCurrentGuideSteps(null);
  };

  // Render (unchanged)
  return (
    <div className="chat-component">
      <button className="chat-button" onClick={toggleChatVisibility}>
        {isChatOpen ? "Close Chat" : "Ask a Question"}
      </button>
      {isChatOpen && (
        <div className="chat-box">
          <div id="container">
            <div className="container-inner">
              <div className="content" ref={contentRef}>
                {chatHistory.length === 0 ? (
                  <p className="welcome-message">
                    {userName
                      ? `Welcome, ${userName}! Ask a question to start a conversation with the Padget AI Assistant Malini.`
                      : "Welcome to the chat! Ask a question to start a conversation with the Padget AI Assistant Malini."}
                  </p>
                ) : (
                  chatHistory.map((chat, index) => (
                    <div key={index}>
                      {chat.user && (
                        <p className="user-message">
                          <strong>You:</strong> {chat.user}
                        </p>
                      )}
                      {chat.bot && (
                        <p className="teacher-response">
                          <strong>Malini:</strong> {chat.bot}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="input-container">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={userInput}
                    onChange={handleUserInput}
                    placeholder="Type your message..."
                    required
                  />
                  {SpeechRecognition && (
                    <button
                      type="button"
                      onMouseDown={startListening}
                      onMouseUp={stopListening}
                      onTouchStart={startListening}
                      onTouchEnd={stopListening}
                    >
                      {isListening ? "Listening..." : "Hold to Speak"}
                    </button>
                  )}
                  <button type="submit" disabled={loading}>
                    <i className="send-icon">{loading ? "Sending..." : "➤"}</i>
                    <span>Send</span>
                  </button>
                </form>
              </div>
              {chatHistory.length > 0 && (
                <div className="buttons">
                  <button type="button" className="confirm" onClick={toggleChatVisibility}>
                    Close Chat
                  </button>
                  <button type="button" className="cancel" onClick={handleClearChatHistory}>
                    Clear Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};