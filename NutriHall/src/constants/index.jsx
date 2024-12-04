import { IceCreamCone } from "lucide-react";
import { Brain } from "lucide-react";
import { SquarePen } from "lucide-react";
import { Flame } from "lucide-react";
import { KeyRound } from "lucide-react";
import { TabletSmartphone } from "lucide-react";

export const navItems = [
  { label: "Features", href: "#features" },
  { label: "At a Glance", href: "#glance" },
];


export const features = [
  {
    icon: <IceCreamCone />,
    text: "Dining Hall Menus at a Glance",
    description:
      "Easily browse menus for all college dining halls on campus. See what's being served in real time and plan your meals ahead of time with just a few taps.",
  },
  {
    icon: <SquarePen />,
    text: "Track Meals and Nutrition",
    description:
      "Log your meals and monitor your daily calorie intake, macros, and nutrients. Stay on top of your health goals while enjoying the flexibility of dining hall options.",
  },
  {
    icon: <Flame />,
    text: "Calorie Recommendations",
    description:
      "Input your height, weight, and activity level to receive daily calorie suggestions tailored to your needs. NutriHall helps you eat smarter, not harder.",
  },
  {
    icon: <Brain />,
    text: "Daily Meal Suggestions Made Easy (AI)",
    description:
      "Get curated meal ideas based on your nutrition goals and dining hall availability. Whether you're looking to bulk up, slim down, or maintain, we've got you covered.",
  },
  {
    icon: <KeyRound />,
    text: "Seamless Login for a Personalized Experience",
    description:
      "Access your preferences, meal logs, and recommendations effortlessly with secure and user-friendly login functionality.",
  },
  {
    icon: <TabletSmartphone />,
    text: "Dynamic and Mobile-Friendly App Design",
    description:
      "Optimized for all devices, NutriHall ensures a smooth experience whether you're on your laptop or checking it on your phone. Perfect for on-the-go dining planning.",
  },
];

export const checklistItems = [
  {
    title: "Explore Menus in Seconds",
    description:
      "Quickly browse dining hall offerings and plan your next meal with ease, all in one place.",
  },
  {
    title: "Track What You Eat",
    description:
      "Log meals, check your macros, and stay aligned with your nutrition goals, effortlessly.",
  },
  {
    title: "AI Assistance to Plan Meals",
    description:
      "Get tailored meal ideas based on your dietary needs and what's available nearby.",
  },
  {
    title: "Optimized for Mobile",
    description:
      "Access menus and meal tracking on any device, optimized for busy student life.",
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "API Reference" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Jobs" },
];