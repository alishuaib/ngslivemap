# NGS Live Map - Online Map for Phantasy Star Online 2: New Genesis

This is a interactive live map for the game Phantasy Star Online 2: New Genesis.

It is designed to let players find resources, enemies, and other points of interest in the game while also being able to contribute to the map as new content is discovered.

## 💭 Motivation & Problem

The goal of this project is to solve the problem of players (especially newbies) finding crucial resources that reset daily.

Even missing a few resources can set a player back a few days in terms of progression. It's a frustrating problem for not only the player but also for the game developers wanting to keep players engaged.

On top of that, the game is constantly being updated with new content making maps quickly outdated or in complete.

The community needed a live interactive map that could be updated, quickly accessible and easy to use.

This project aims to solve that problem.

## 🚀 Quick Start

### Video Demonstration [2 minutes]

Watch this 4 minute video for a demonstration of NGS Live Map

<div>
    <a href="https://www.loom.com/share/0bf7ab4d869a4e6688d0c3bc10fb8b46">
    <p>NGS Live Map Demonstration - Watch Video</p>
    </a>
    <a href="https://www.loom.com/share/0bf7ab4d869a4e6688d0c3bc10fb8b46">
    <img style="max-width:200px;" src="https://cdn.loom.com/sessions/thumbnails/0bf7ab4d869a4e6688d0c3bc10fb8b46-with-play.gif">
    </a>
</div>

### View Live Demo

Check out a live demo at [ngs.matoi.ca](https://ngs.matoi.ca)

## 📖 Features / Usage

-   View Resources, Enemies, Collectibles, and Points of Interest
-   View Layers for underground zones.
-   Region Border Highlights
-   Mobile friendly design
-   Complete Dashboard for Contributors for easy updating.
-   Secure Authentication & Version Tracing for Contributors

## 🤝 Contributing

### ⚠ You will need to setup the following services

-   MongoDB Cloud Database [www.mongodb.com](https://www.mongodb.com/products/platform/cloud)

### Clone the repo

```bash
git clone https://github.com/alishuaib/ngslivemap@latest
cd ngslivemap
```

### Install dependencies

```bash
npm install
```

### Copy environment variables example and read instructions for setup

```bash
cp .env.example .env
```

### Enter your mongodb connection string in .env

### Start the development server

```bash
npm run dev
```
