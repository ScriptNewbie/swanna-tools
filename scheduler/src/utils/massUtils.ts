export interface Mass {
  id: number;
  hour: string;
  intention: string;
  chapel: boolean;
}

export interface MassSchedule {
  [isoDateString: string]: Mass[] | undefined;
}

export const getMostLikelyNewMass = (date: Date, alreadyPresent: Mass[]) => {
  const day = date.getDay();
  const mostCommonMassesForDay =
    day === 0
      ? [
          { hour: "08:00", intention: "Za Parafian", chapel: true },
          { hour: "10:00", intention: "Za Parafian", chapel: false },
          { hour: "12:00", intention: "Za Parafian", chapel: false },
          { hour: "15:00", intention: "Za Parafian", chapel: false },
        ]
      : day === 2
      ? [
          { hour: "07:30", intention: "Za Parafian", chapel: true },
          { hour: "18:00", intention: "Za Parafian", chapel: false },
        ]
      : [
          { hour: "18:00", intention: "Za Parafian", chapel: false },
          { hour: "08:00", intention: "Za Parafian", chapel: true },
        ];

  for (let i = 0; i < mostCommonMassesForDay.length; ++i) {
    const potentialMass = mostCommonMassesForDay[i];
    if (
      !alreadyPresent.find(
        (presentMass) => potentialMass.hour === presentMass.hour
      )
    )
      return {
        id: alreadyPresent.reduce((a, b) => a + b.id, 1),
        ...potentialMass,
      };
  }
  return {
    id: alreadyPresent.reduce((a, b) => a + b.id, 1),
    hour: "18:00",
    intention: "Za Parafian",
    chapel: false,
  };
};
