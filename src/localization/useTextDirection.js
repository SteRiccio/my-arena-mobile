import { useEffect, useState } from "react";

import { i18n } from "./i18n";

export const textDirections = {
  rtl: "rtl",
  ltr: "ltr",
};

const isRtlByLang = {
  fa: true,
};

const getLanguageTextDirection = (lang) => {
  const isRtl = !!isRtlByLang[lang];
  return isRtl ? textDirections.rtl : textDirections.ltr;
};

export const useTextDirection = () => {
  const lang = i18n.language;
  const [textDirection, setTextDirection] = useState(
    getLanguageTextDirection(lang)
  );

  useEffect(() => {
    const direction = getLanguageTextDirection(lang);
    if (direction !== textDirection) {
      setTextDirection(direction);
    }
  }, [lang, textDirection]);

  return textDirection;
};
