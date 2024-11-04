import { motion } from "framer-motion";
import imgAllMenu from "../img/undraw_barbecue.svg";
// Import all restriction images
import veganImg from '../assets/vegan.gif';
import alcoholImg from '../assets/alcohol.gif';
import beefImg from '../assets/beef.gif';
import fishImg from '../assets/fish.gif';
import glutenImg from '../assets/gluten.gif';
import halalImg from '../assets/halal.gif';
import nutsImg from '../assets/nuts.gif';
import porkImg from '../assets/pork.gif';
import shellfishImg from '../assets/shellfish.gif';
import treenutImg from '../assets/treenut.gif';
import soyImg from '../assets/soy.gif';
import sesameImg from '../assets/sesame.gif';
import milkImg from '../assets/milk.gif';
import eggsImg from '../assets/eggs.gif';
import veggieImg from '../assets/veggie.gif';

// Define the restrictionImages object
const restrictionImages = {
  vegan: veganImg,
  alcohol: alcoholImg,
  beef: beefImg,
  fish: fishImg,
  gluten: glutenImg,
  halal: halalImg,
  nuts: nutsImg,
  pork: porkImg,
  shellfish: shellfishImg,
  treenut: treenutImg,
  soy: soyImg,
  sesame: sesameImg,
  milk: milkImg,
  eggs: eggsImg,
  veggie: veggieImg,
};

const MenuAll = ({ all, items }) => {
  const itemContainer = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      {all &&
        items.map((item, i) => (
          <motion.div
            className="menu-items"
            key={item.id}
            variants={itemContainer}
            transition={{ delay: i * 0.2 }}
          >
          
            <motion.div className="item-content">
              <motion.div className="item-title-box">
                <motion.h5 className="item-title">{item.title}</motion.h5>
                  <motion.div className="item-image-restrictions">
                    {item.restrictions.map((restriction) => 
                      restrictionImages[restriction] ? (
                        <img
                         // key={restriction}
                          src={restrictionImages[restriction]}
                          alt={restriction}
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            marginRight: "5px",
                            objectFit: "cover",
                          }}
                        />
                      ) : null
                    )}
                  </motion.div>
              </motion.div>
              <motion.div className="item-restrictions">
                {item.restrictions.length > 0
                    ? <p>Restrictions: {item.restrictions.join(", ")}</p>
                    : <p>No restrictions</p>}
                </motion.div>
            </motion.div>
          </motion.div>
        ))}
    </>
  );
};

export default MenuAll;
