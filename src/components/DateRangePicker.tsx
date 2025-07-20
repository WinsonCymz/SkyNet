import React, { useEffect, useRef } from "react";

const today = new Date();

const getMonthData = (offset: number) => {
  const baseDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  return {
    name: baseDate.toLocaleString("default", { month: "long" }),
    year,
    month,
    days,
    firstDay,
  };
};

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

// function formatDate(d: Date | null) {
//   if (!d) return "";
//   return d.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// }

interface DateRangePickerProps {
  activeField: "depart" | "return";
  onClose: () => void;
  departDate: Date | null;
  returnDate: Date | null;
  setDepartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setReturnDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  activeField,
  onClose,
  departDate,
  returnDate,
  setDepartDate,
  setReturnDate,
}) => {
  const [monthOffset, setMonthOffset] = React.useState(0);
  const months = [getMonthData(monthOffset), getMonthData(monthOffset + 1)];
  // monthIdx: 0 (thisMonth), 1 (nextMonth)
  function getDate(monthIdx: number, day: number) {
    const year = months[monthIdx].year;
    const month = months[monthIdx].month;
    return new Date(year, month, day);
  }

  function handleDayClick(monthIdx: number, day: number) {
    const picked = getDate(monthIdx, day);
    if (activeField === "depart") {
      setDepartDate(picked);
      if (returnDate && picked > returnDate) setReturnDate(null);
    } else {
      if (departDate && picked >= departDate) {
        setReturnDate(picked);
      } else if (!departDate) {
        setDepartDate(picked);
      }
    }
  }

  function isSelected(monthIdx: number, day: number) {
    const d = getDate(monthIdx, day);
    return (
      (departDate && d.toDateString() === departDate.toDateString()) ||
      (returnDate && d.toDateString() === returnDate.toDateString())
    );
  }

  function isInRange(monthIdx: number, day: number) {
    if (departDate && returnDate) {
      const d = getDate(monthIdx, day);
      return d > departDate && d < returnDate;
    }
    return false;
  }

  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="date-selector" ref={pickerRef}>
      <div className="calendar-dropdown">
        <div className="calendar-header">
          <button
            className="nav-button"
            onClick={() => {
              if (monthOffset > 0) {
                setMonthOffset((prev) => prev - 1);
              }
            }}
          >
            &lt;
          </button>
          <div className="month-container">
            <span>{months[0].name}</span>
            <span>{months[1].name}</span>
          </div>
          <button
            className="nav-button"
            onClick={() => setMonthOffset((prev) => prev + 1)}
          >
            &gt;
          </button>
        </div>
        <div className="calendar-months">
          {months.map((month, monthIdx) => {
            const blanks = Array.from({ length: (month.firstDay + 6) % 7 });
            return (
              <div key={month.name} className="calendar-month">
                <h4>{month.name}</h4>
                <div className="calendar-grid">
                  {dayLabels.map((d) => (
                    <span key={d} className="day-label">
                      {d}
                    </span>
                  ))}
                  {blanks.map((_, i) => (
                    <span key={"b" + i} className="day-blank"></span>
                  ))}
                  {Array.from({ length: month.days }, (_, i) => {
                    const day = i + 1;
                    const selected = isSelected(monthIdx, day);
                    const inRange = isInRange(monthIdx, day);
                    const date = getDate(monthIdx, day);
                    const isBeforeToday =
                      date < new Date(today.setHours(0, 0, 0, 0));
                    const disabled = Boolean(
                      (activeField === "return" &&
                        departDate &&
                        date < new Date(departDate.setHours(0, 0, 0, 0))) ||
                        isBeforeToday
                    );

                    return (
                      <button
                        key={day}
                        className={`day${selected ? " selected" : ""}${
                          inRange ? " in-range" : ""
                        }`}
                        type="button"
                        onClick={() => handleDayClick(monthIdx, day)}
                        disabled={disabled}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" onClick={onClose} className="apply-btn">
          Apply
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
