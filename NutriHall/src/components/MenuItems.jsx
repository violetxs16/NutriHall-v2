/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx } from "@emotion/react";
import { motion } from "framer-motion";
import MenuAll from "./MenuAll";
import { ThemeContext } from '../contexts/ThemeContext';

const MenuItems = ({
  items,
  searchQuery,
  selectedDiningHall,
  all,
  breakfast,
  lunch,
  dinner,
  onDiningHallClick,
}) => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  const { theme } = useContext(ThemeContext);
  const breakpoints = [576, 768, 992, 1200];
  const mq = breakpoints.map((bp) => `@media (max-width: ${bp}px)`);

  return (
    <motion.div
      className="MenuItems container"
      variants={container}
      initial="hidden"
      animate="visible"
      css={css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        ${mq[2]} {
          grid-template-columns: 1fr;
        }
        margin-top: 30px;
        padding: 40px 20px;
        background: ${theme === 'mytheme' ? '#fff' : '#171F2A'};
        border-radius: 50px;
  
        .menu-items {
          padding: 1.5rem;
          display: grid;
          grid-template-rows: auto 1fr auto;
          border: ${theme === 'mytheme' ? '#efefef' : '#0B0B0D'} 1px solid;
          border-top: none;
          color: ${theme === 'mytheme' ? '#000' : '#fff'};
          background: ${theme === 'mytheme' ? '#f9f9f9' : '#18181b'};
          border-radius: 15px;
  
          ${mq[0]} {
            grid-template-rows: auto 1fr auto;
            img {
              margin-bottom: 10px;
            }
          }
  
          &:last-child {
            border-bottom: none;
          }
  
          &:nth-child(odd) {
            border-left: none;
            ${mq[2]} {
              border-right: none;
            }
          }
  
          &:nth-child(even) {
            border-right: none;
            ${mq[2]} {
              border-left: none;
            }
          }
  
          .item-content {
            display: grid;
            grid-template-rows: auto 1fr auto;
            gap: 10px;
  
            .item-title-box {
              display: flex;
              justify-content: space-between;
  
              .item-title {
                font-size: 1rem;
                font-weight: bold;
                color: ${theme === 'mytheme' ? '#333' : '#BEBEBE'};
                ${mq[(0, 1)]} {
                  font-size: 0.9rem;
                }
              }
  
              .item-restrictions {
                font-size: 0.9rem;
                color: #777;
                ${mq[(0, 1)]} {
                  font-size: 0.8rem;
                }
              }
            }
  
            .nutrition-info {
              display: flex;
              justify-content: center;
              align-items: center;
              background: #e0e0e0;
              padding: 0.5rem;
              border-radius: 10px;
              font-size: 0.8rem;
              color: #555;
            }
  
            .record-button {
              display: flex;
              justify-content: center;
              margin-top: 10px;
  
              button {
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                &:hover {
                  background: #0056b3;
                }
              }
            }
          }
        }
  
        img {
          height: 85px;
          ${mq[(0, 1)]} {
            height: 75px;
          }
          cursor: pointer;
        }
      `}
    >
      <MenuAll
        items={items}
        searchQuery={searchQuery}
        selectedDiningHall={selectedDiningHall}
        all={all}
        breakfast={breakfast}
        lunch={lunch}
        dinner={dinner}
        onDiningHallClick={onDiningHallClick}
      />
    </motion.div>
  );
  
};

export default MenuItems;

