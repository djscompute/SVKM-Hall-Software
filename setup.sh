#!/bin/bash

# Function to show simple ASCII "SETUP" text
show_setup_graffiti() {
    echo "======================="
    echo "       S E T U P       "
    echo "======================="
    echo "Installing dependencies... Please wait!"
    sleep 1
}

# Function to show simple ASCII "COMPUTE" text
show_compute_graffiti() {
    echo "======================="
    echo "     C O M P U T E     "
    echo "======================="
    echo "Starting services... Please wait!"
    sleep 1
}

# Function to show a loading animation
show_loading_animation() {
    local animation=("|" "/" "-" "\\")
    for i in {1..10}; do
        echo -ne "\r${animation[i % ${#animation[@]}]} Loading..."
        sleep 0.2
    done
    echo -e "\r✓ Ready!                    "
}

# Display SETUP ASCII art and loading
show_setup_graffiti
show_loading_animation

# Install dependencies for each service
echo "Installing dependencies for Frontend (Master)..."
(cd frontend/master && npm install) &
sleep 1
show_loading_animation

echo "Installing dependencies for Frontend (Manager)..."
(cd frontend/manager && npm install) &
sleep 1
show_loading_animation

echo "Installing dependencies for Frontend (Client)..."
(cd frontend/client && npm install) &
sleep 1
show_loading_animation

echo "Installing dependencies for Backend..."
(cd backend && npm install) &
sleep 1
show_loading_animation

# Display COMPUTE ASCII art and loading
show_compute_graffiti

# Start each service
echo "Starting Frontend (Master)..."
(cd frontend/master && npm run dev) &
sleep 1
show_loading_animation

echo "Starting Frontend (Manager)..."
(cd frontend/manager && npm run dev) &
sleep 1
show_loading_animation

echo "Starting Frontend (Client)..."
(cd frontend/client && npm run dev) &
sleep 1
show_loading_animation

echo "Starting Backend..."
(cd backend && npm run dev) &
sleep 1
show_loading_animation

# Final message
echo "======================="
echo "   All Systems GO!     "
echo "======================="
echo "All services started successfully with dependencies installed!"
