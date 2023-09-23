import React, { useEffect, useState } from "react";
import "./section.css";
import { SectionItem } from "./types";

const BASE_ITEM: SectionItem = {
  id: "id-",
  sprintName: "SMA-399",
  title: `Improve the experience that allows a lender or borrower add a friend to their list of friends 66 by inputting their email address in addition to their name and phone number`,
  date: new Date(2023, 8, 21),
  count: 10,
  group: "a group",
  prioririy: "high",
};

const Items: SectionItem[] = new Array(12).fill(0).map((_, i) => ({
  ...BASE_ITEM,
  id: BASE_ITEM.id + (i + 1).toString(),
  title: BASE_ITEM.title + " " + (i + 1),
  date: new Date(2023, 8, 21 + (i % 2)),
  count: 2 + Math.floor(Math.random() * (10 - 2)),
}));

const KanbanSection: React.FC<{
  title: string;
}> = ({ title }) => {
  const [sectionItems, setSectionItems] = useState(Items);
  const [lastItem, setLastItem] = useState("");
  const [mousePressed, setMousePressed] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: -1, y: -1 });
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [swap, setSwap] = useState({
    current: -1,
    previous: -1,
  });

  useEffect(() => {
    if (!lastItem) {
      setDelta({ x: 0, y: 0 });
      setSelectedIndex(-1);
      const { current, previous } = swap;
      if (current > -1 && previous > -1) {
        const copy = sectionItems.slice(0);
        copy.splice(current, 0, copy.splice(previous, 1)[0]);
        setSectionItems(copy);
      }
    } else {
      setSwap({
        current: -1,
        previous: -1,
      });
      setSelectedIndex(sectionItems.findIndex((v) => v.id === lastItem));
    }
  }, [lastItem]);
  const onMouseDown: (id: string) => React.MouseEventHandler<any> = (id) => {
    return ({ pageX, pageY }) => {
      setLastItem(id);
      setLastMousePosition({
        x: pageX,
        y: pageY,
      });
    };
  };

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = ({
    pageX,
    pageY,
  }) => {
    if (!lastItem) {
      return;
    }
    setDelta({
      x: pageX - lastMousePosition.x,
      y: pageY - lastMousePosition.y,
    });
  };

  const swaps = (current: number, previous: number) => {
    setSwap({ current, previous });
  };
  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = ({ pageY }) => {
    const directionDown = delta.y > -1;
    const selected = document.getElementById(lastItem)!;
    const selectedRect = selected.getBoundingClientRect();
    const distances = sectionItems
      .map((v, i) => ({ index: i, id: v.id }))
      .filter((v) => v.id !== lastItem)
      .map((v) => {
        const current = document.getElementById(v.id)!;
        const currentRect = current.getBoundingClientRect();
        const distance = selectedRect.bottom - currentRect.top;

        return {
          distanceBottomTop: selectedRect.bottom - currentRect.top,
          distanceTopBottom: selectedRect.top - currentRect.bottom,
          top: currentRect.top,
          bottom: currentRect.bottom,
          height: currentRect.height,
          isAbove: selectedRect.top > currentRect.bottom,
          index: v.index,
        };
      })
      .sort(
        (a, b) => Math.abs(a.distanceBottomTop) - Math.abs(b.distanceBottomTop)
      );
    if (distances.length > 0 && selectedIndex > -1) {

      const closest = distances[0];
      const direction = closest.index - selectedIndex;

      console.info(
    
        closest,
        selectedIndex,
        closest.index - selectedIndex,
        direction
      );
      const isNeighbour = Math.abs(direction) === 1;
      let indexToSwap = -1;
      if (direction > 0) {
    //     console.log("here22");
    //     if (isNeighbour && closest.isAbove && sectionItems.length === 2) {
    //         swaps(closest.index, selectedIndex);
    //     } else {
          swaps(closest.index - 1, selectedIndex);
       } else {
        swaps(closest.index, selectedIndex);
      }
    }
    setLastItem("");
    setMousePressed(false);
  };

  const computeOffset = (index: number, id: string) => {
    if (!lastItem) {
      return 0;
    }
    const current = document.getElementById(id);
    const selected = document.getElementById(lastItem);
    if (!selected || !current) {
      return 0;
    }
    const currentRect = current.getBoundingClientRect();
    const selectedRect = selected.getBoundingClientRect();
    const halfCurrentHeight = currentRect.height / 2;

    if (selectedRect.x > currentRect.right - 10 && selectedIndex < index) {
      return -selectedRect.height;
    } else if (selectedRect.right < currentRect.x && selectedIndex < index) {
      return -selectedRect.height;
    } else if (
      currentRect.y + halfCurrentHeight < selectedRect.bottom &&
      selectedIndex < index
    ) {
      return -selectedRect.height;
    } else if (
      currentRect.y + halfCurrentHeight > selectedRect.bottom &&
      index < selectedIndex
    ) {
      return selectedRect.height;
    }
    return 0;
  };

  return (
    <div
      className="section-container"
      draggable={false}
      onMouseMove={onMouseMove}
    >
      <h2 className="section-container-title">{title}</h2>

      <div className="my-8" draggable={false}>
        {sectionItems.map((v, i) => {
          let x = 0,
            y = 0,
            transition = "none";

          const selected = lastItem === v.id;
          if (selected) {
            x = delta.x;
            y = delta.y;
          } else {
            y = computeOffset(i, v.id);
              transition = lastItem ? "transform 200ms" : "none";
          }
          const style: React.HTMLAttributes<HTMLDivElement>["style"] = {
            transform: `translate(${x}px, ${y}px)`,
            transition,
            zIndex: Number(selected) * 99999,
          };

          return (
            <div
              style={style}
              draggable={false}
              id={v.id}
              className="section-item pointer"
              key={v.id}
              onMouseUp={onMouseUp}
              onMouseDown={onMouseDown(v.id)}
            >
              <p className="section-item-title">{v.title}</p>

              <div className="flex flex-row">
                <div className="pointer">
                  <span className="section-item-count">{v.id}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanSection;
