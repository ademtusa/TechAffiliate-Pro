#!/bin/bash

# Fix media page
sed -i '/useEffect(() => {/,/}, \[toast\])/c\  const fetchMedia = async () => {' /app/app/admin-panel/media/page.js

# Fix menus page  
sed -i '/useEffect(() => {/,/}, \[toast\])/c\  const fetchMenus = async () => {' /app/app/admin-panel/menus/page.js

# Fix messages page
sed -i '/useEffect(() => {/,/}, \[toast\])/c\  const fetchMessages = async () => {' /app/app/admin-panel/messages/page.js

# Fix resources page
sed -i '/useEffect(() => {/,/}, \[toast\])/c\  const fetchResources = async () => {' /app/app/admin-panel/resources/page.js

# Fix settings page
sed -i '/useEffect(() => {/,/}, \[toast\])/c\  const fetchSettings = async () => {' /app/app/admin-panel/settings/page.js

# Fix testimonials page
sed -i '/useEffect(() => {/,/}, \[toast\])/c\  const fetchTestimonials = async () => {' /app/app/admin-panel/testimonials/page.js
