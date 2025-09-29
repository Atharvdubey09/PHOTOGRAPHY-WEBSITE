@echo off
echo ===============================================
echo Studio Pro - Automatic Vercel Deployment
echo Contact: dubeyatharv36@gmail.com
echo Phone: 7021763330
echo Location: Mumbai, Maharashtra, India
echo ===============================================
echo.

echo Step 1: Checking Vercel CLI...
vercel --version
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

echo.
echo Step 2: Login to Vercel...
echo Please complete the login in your browser when it opens.
vercel login

echo.
echo Step 3: Deploying Studio Pro to Vercel...
vercel --prod --yes

echo.
echo ===============================================
echo Deployment Complete!
echo Your Studio Pro website should now be live.
echo ===============================================
pause