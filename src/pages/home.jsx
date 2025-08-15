import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PatternFormat } from "react-number-format";
import Loader from "../components/loader";
import direktor from "../assets/img/derektor.webp";
import mainBGHome from "../assets/img/homeBgMain.webp";
import mainBG from "../assets/img/mainBg.webp";
import camIcon from "../assets/icons/cam-icon.svg";
import modalStep from "../assets/icons/modalStep.svg";
import giftIcon from "../assets/icons/gift.svg";
import styles from "./home.module.css";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [pageLoaded, setPageLoaded] = useState(false);

  const totalTime = 30;

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanedNumber = number.replace(/\D/g, "");

    navigate("/last");
    setNumber("");
    setName("");
    setIsLoading(false);

    const url =
      "https://script.google.com/macros/s/AKfycbxeBRgJLeeTe6Mz4jBJpOvjsDOXFXsRYQwSOM8eOUvog_DyJ6fsJLmgMGIWgbfeHu4_og/exec";

    const formData = new URLSearchParams();
    formData.append("Name", name);
    formData.append("Email", cleanedNumber);

    navigator.sendBeacon(url, formData);
  };

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const minutes = String(Math.floor(sec / 60)).padStart(2, "0");
    const seconds = String(sec % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const progressWidth = Math.max((timeLeft / totalTime) * 179, 50);

  useEffect(() => {
    const imageList = [direktor, mainBGHome, mainBG];

    let loadedCount = 0;
    imageList.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imageList.length) {
          setPageLoaded(true);
        }
      };
    });
  }, []);

  if (!pageLoaded) return <Loader />;

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.wrapper}>
        <div className={styles.navbar}>
          <div className={styles.navbarHeader}>
            <img src={camIcon} alt="camIcon" />
            <p>Online • 20:00 • 22-Avgust</p>
          </div>
        </div>
        <div className={styles.body}>
          <img src={direktor} alt="direktor" className={styles.bodyImg} />
        </div>
        <div className={styles.footer}>
          <p className={styles.footerTitile}>Boshlang’ich to’lovsiz</p>
          <p className={styles.footerTitile1}>
            60 oyga Foizlarsiz bo’lib to’lash taklifi bilan
          </p>
          <p className={styles.footerTitile2}>Xonadonli bo’lishingiz mumkin</p>

          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className={styles.navbarButton}
          >
            BEPUL qatnashish
          </button>

          <p className={styles.footerLast}>
            22-avgust, soat 20:00 da Telegram kanalda jonli efir, qolib ketmang
          </p>

          <div className={styles.timer}>
            <div
              className={styles.interval}
              style={{
                width: `${progressWidth}px`,
                transition: "width 1s linear",
              }}
            ></div>
            <p className={styles.time}>{formatTime(timeLeft)}</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={modalStep} alt="modalStep" className={styles.modalStep} />
            <p className={styles.information}>ma'lumotlaringizni qoldiring!</p>
            <div className={styles.form}>
              <div className={styles.inputs}>
                <input
                  type="text"
                  placeholder="Ismingiz"
                  name="name"
                  value={name || ""}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <PatternFormat
                  format="+998 ## ### ## ##"
                  allowEmptyFormatting
                  name="number"
                  mask=" "
                  value={number || ""}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                  className={styles.contactInputPhone}
                  autoComplete="off"
                  placeholder="Telefon raqamingiz"
                />
              </div>
              <div className={styles.submit}>
                <button
                  className={number && name ? styles.activeButton : ""}
                  disabled={!number || !name || isLoading}
                  onClick={handleSubmit}
                >
                  Davom etish
                </button>
                {isLoading && <div className={styles.loader}></div>}
              </div>
              <div className={styles.gift}>
                <img src={giftIcon} alt="giftIcon" />
                <p>Uy yutib olish imkoniyati</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
