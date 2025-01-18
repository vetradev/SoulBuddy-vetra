
export type GemstoneInfo = {
    gemstone: string;
    reason: string;
    whenToWear: string;
    properties: string;
    benefits: string;
    chakras?: string; // Optional field
    additionalSuggestion?: string; // Optional field for extra details
  };
  
  export const gemstoneData: { [key: string]: GemstoneInfo } = {
    aries: {
      gemstone: "Diamond",
      reason: "Diamonds help balance the energetic and fiery nature of Aries by bringing clarity, courage, and protection.",
      whenToWear: "Wear during important life decisions or when needing clarity in communication.",
      properties: "Diamond enhances strength, power, and mental clarity. It is often associated with purity and commitment.",
      benefits: "Improves focus, aligns emotional and mental clarity, and enhances leadership skills.",
      chakras: "Crown Chakra",
      additionalSuggestion: "Regularly cleanse the diamond to maintain its energy."
    },
    taurus: {
      gemstone: "Emerald",
      reason: "Emerald helps Taurus stay grounded while promoting emotional balance and prosperity.",
      whenToWear: "During moments of emotional imbalance or financial challenges.",
      properties: "Emerald is a symbol of love, rebirth, and wisdom. It fosters loyalty and strengthens relationships.",
      benefits: "Enhances creativity, opens the heart, and promotes wealth and success.",
      chakras: "Heart Chakra",
      additionalSuggestion: "Avoid exposing the emerald to extreme heat to preserve its beauty."
    },
    gemini: {
      gemstone: "Agate",
      reason: "Agate aids Gemini in finding balance between their dual nature, fostering stability and harmony.",
      whenToWear: "During moments of mental overload or when seeking balance.",
      properties: "Agate is known for its grounding properties, providing stability, clarity, and harmony.",
      benefits: "Enhances communication, mental clarity, and emotional stability.",
      chakras: "Throat and Third Eye Chakra",
      additionalSuggestion: "Meditate with agate to enhance its grounding energy."
    },
    cancer: {
      gemstone: "Moonstone",
      reason: "Moonstone connects with Cancer's emotional nature, enhancing intuition and emotional balance.",
      whenToWear: "When feeling emotionally overwhelmed or needing to connect with intuition.",
      properties: "Moonstone symbolizes intuition, emotional balance, and new beginnings.",
      benefits: "Boosts emotional intelligence, fosters calm, and improves psychic abilities.",
      chakras: "Crown Chakra",
      additionalSuggestion: "Use moonstone to enhance your connection with lunar energy during full moons."
    },
    leo: {
      gemstone: "Ruby",
      reason: "Ruby amplifies Leo’s inner strength and passion, helping them to confidently pursue their goals.",
      whenToWear: "Wear when seeking strength, courage, or a boost in passion and energy.",
      properties: "Ruby is a symbol of love, power, and vitality. It enhances confidence and courage.",
      benefits: "Increases energy, promotes leadership, and boosts emotional well-being.",
      chakras: "Root Chakra",
      additionalSuggestion: "Wear ruby in jewelry to maximize its energizing effects."
    },
    virgo: {
      gemstone: "Sapphire",
      reason: "Sapphire enhances Virgo’s analytical skills while promoting calm and mental clarity.",
      whenToWear: "When seeking mental clarity or needing focus during work or decision-making.",
      properties: "Sapphire represents wisdom, purity, and spiritual enlightenment. It also enhances focus.",
      benefits: "Boosts intellect, provides mental clarity, and promotes inner peace.",
      chakras: "Third Eye Chakra",
      additionalSuggestion: "Keep your sapphire clean by gently wiping it with a soft cloth to maintain its clarity."
    },
    libra: {
      gemstone: "Opal",
      reason: "Opal helps Libra balance their social nature and maintain harmony in relationships.",
      whenToWear: "Wear when seeking emotional balance or when feeling indecisive.",
      properties: "Opal symbolizes creativity, emotional balance, and love. It enhances artistic expression.",
      benefits: "Enhances creativity, brings emotional balance, and promotes love and relationships.",
      chakras: "Sacral Chakra",
      additionalSuggestion: "Use opal during creative endeavors or artistic projects to enhance your expression."
    },
    scorpio: {
      gemstone: "Topaz",
      reason: "Topaz helps Scorpio release negative emotions and promotes emotional healing and transformation.",
      whenToWear: "Wear when seeking emotional healing or during periods of personal transformation.",
      properties: "Topaz is a powerful gemstone that promotes emotional balance, love, and personal growth.",
      benefits: "Helps with emotional healing, brings peace, and enhances personal growth and transformation.",
      chakras: "Solar Plexus Chakra",
      additionalSuggestion: "Cleanse topaz regularly to maintain its powerful energetic properties."
    },
    sagittarius: {
      gemstone: "Turquoise",
      reason: "Turquoise supports Sagittarius in embracing their adventurous nature while bringing inner peace.",
      whenToWear: "Wear during travels or when seeking protection and clarity in communication.",
      properties: "Turquoise represents wisdom, protection, and balance. It enhances creativity and intuition.",
      benefits: "Promotes emotional balance, enhances creativity, and protects from negative energy.",
      chakras: "Throat Chakra",
      additionalSuggestion: "Wear turquoise as a necklace to keep it close to the throat chakra."
    },
    capricorn: {
      gemstone: "Garnet",
      reason: "Garnet helps Capricorn stay grounded while encouraging prosperity and success.",
      whenToWear: "Wear when working towards personal goals or financial success.",
      properties: "Garnet represents passion, strength, and commitment. It helps to boost self-confidence.",
      benefits: "Increases energy, promotes prosperity, and encourages strong relationships.",
      chakras: "Root Chakra",
      additionalSuggestion: "Keep garnet close to the skin to maximize its grounding effects."
    },
    aquarius: {
      gemstone: "Amethyst",
      reason: "Amethyst helps Aquarius clear their mind and enhance spiritual awareness and intuition.",
      whenToWear: "Wear when seeking spiritual clarity or calming energy.",
      properties: "Amethyst symbolizes spiritual growth, clarity, and calm. It enhances intuition and meditation.",
      benefits: "Promotes spiritual awareness, calmness, and emotional healing.",
      chakras: "Third Eye Chakra",
      additionalSuggestion: "Use amethyst during meditation to enhance your spiritual connection."
    },
    pisces: {
      gemstone: "Aquamarine",
      reason: "Aquamarine helps Pisces align with their emotional sensitivity while promoting tranquility.",
      whenToWear: "Wear when seeking emotional balance or protection from negative emotions.",
      properties: "Aquamarine represents peace, protection, and courage. It soothes emotional wounds.",
      benefits: "Promotes calmness, enhances communication, and encourages healing.",
      chakras: "Throat Chakra",
      additionalSuggestion: "Keep aquamarine near water for additional healing properties."
    },
  };