import React from "react";
import { notification } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const successSound = new Audio("/sounds/success.mp3");
const errorSound = new Audio("/sounds/error.mp3");
const warningSound = new Audio("/sounds/warning.mp3");
const infoSound = new Audio("/sounds/info.mp3");

const play = (audio) => {
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {}
};


const show = (text, icon, background, audio) => {
  play(audio);

  notification.open({
    className: "attl-notification",

    message: null,

    description: (
      <div
        style={{
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          lineHeight: "22px",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        {text}
      </div>
    ),

    closeIcon: null,

    placement: "topRight",

    duration: 2.5,

    icon,

    style: {
      width: "fit-content",
      minWidth: 220,
      maxWidth: 420,
      borderRadius: 14,
      background,
      border: "none",
      padding: "14px 18px",
      boxShadow: "0 12px 35px rgba(0,0,0,.25)",
    },
  });
};



const notify = {

  success(text) {
    show(
      text,
      <CheckCircleOutlined
        style={{
          color: "#fff",
          fontSize: 24,
        }}
      />,
      "linear-gradient(135deg,#16a34a,#22c55e)",
      successSound
    );
  },


  error(text) {
    show(
      text,
      <CloseCircleOutlined
        style={{
          color: "#fff",
          fontSize: 24,
        }}
      />,
      "linear-gradient(135deg,#dc2626,#ef4444)",
      errorSound
    );
  },


  warning(text) {
    show(
      text,
      <ExclamationCircleOutlined
        style={{
          color: "#fff",
          fontSize: 24,
        }}
      />,
      "linear-gradient(135deg,#ea580c,#f97316)",
      warningSound
    );
  },


  info(text) {
    show(
      text,
      <InfoCircleOutlined
        style={{
          color: "#fff",
          fontSize: 24,
        }}
      />,
      "linear-gradient(135deg,#2563eb,#3b82f6)",
      infoSound
    );
  },

};


export default notify;