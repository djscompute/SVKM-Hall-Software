#!/bin/bash

# Function to show simple ASCII "COMPUTE" text
show_graffiti() {
    echo "======================="
    echo "     C O M P U T E     "
    echo "======================="
    echo "Starting up... Please wait!"
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

# Display ASCII art and loading
show_graffiti
show_loading_animation

# Start each service in the background
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

# Final message
echo "======================="
echo "   All Systems GO!     "
echo "======================="
echo "All services started successfully!"
