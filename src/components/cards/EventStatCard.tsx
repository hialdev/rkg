import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify-icon/react";
import type { eventStats } from "../../mock";

interface EventStatCardProps {
  eventStat: typeof eventStats[0];
}

const EventStatCard: React.FC<EventStatCardProps> = ({ eventStat }) => {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!counterRef.current) return;

    const target = eventStat.count;
    if (target <= 0) {
      counterRef.current.textContent = target.toLocaleString();
      return;
    }

    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          observer.disconnect();

          setTimeout(() => {
            animateCount(counterRef.current!, target);
          }, 1000);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(counterRef.current);

    return () => {
      observer.disconnect();
    };
  }, [eventStat.count]);

  function animateCount(element: HTMLElement, targetValue: number): void {
    const startTime = performance.now();
    const duration = 3000; // ms

    function update(currentTime: DOMHighResTimeStamp): void {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeProgress * targetValue);

      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = targetValue.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  return (
    <div className="flex flex-col gap-3 items-center text-white">
      <Icon
        icon={eventStat.icon_id}
        width={50}
        className="text-green-600"
      />

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span
            ref={counterRef}
            className="text-3xl font-medium counter"
            data-target={eventStat.count}
          >
            0
          </span>
          <span className="text-green-600 font-bold text-xl">
            {eventStat.unit_count}
          </span>
        </div>

        <p className="text-center">{eventStat.title}</p>
      </div>
    </div>
  );
};

export default EventStatCard;
