'use client'

import React from 'react'

// Notion Icon
export function NotionIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z" fill="#fff"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z" fill="#000"/>
    </svg>
  )
}

// Google Drive Icon
export function GoogleDriveIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
    </svg>
  )
}

// Slack Icon
export function SlackIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 127 127" xmlns="http://www.w3.org/2000/svg">
      <path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2C6.7 93.2.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80z" fill="#E01E5A"/>
      <path d="M47 27c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.5 39.7.6 47 .6c7.3 0 13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9c0-7.3 5.9-13.2 13.2-13.2H47z" fill="#36C5F0"/>
      <path d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6c7.3 0 13.2 5.9 13.2 13.2v33.1z" fill="#2EB67D"/>
      <path d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80.1z" fill="#ECB22E"/>
    </svg>
  )
}

// Confluence Icon
export function ConfluenceIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 246" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient x1="99.14%" y1="112.72%" x2="24.37%" y2="54.88%" id="confluence-a">
          <stop stopColor="#0052CC" offset="0%"/>
          <stop stopColor="#2684FF" offset="100%"/>
        </linearGradient>
        <linearGradient x1="0.86%" y1="-12.72%" x2="75.63%" y2="45.12%" id="confluence-b">
          <stop stopColor="#0052CC" offset="0%"/>
          <stop stopColor="#2684FF" offset="100%"/>
        </linearGradient>
      </defs>
      <path d="M9.26 187.28c-3.23 5.21-6.78 11.18-9.26 15.87a10.28 10.28 0 003.78 14.06l63.09 38.75a10.27 10.27 0 0014.18-3.37c2.17-3.65 5-8.47 8.08-13.55 21.45-35.65 43.25-31.32 82.33-11.76l62.53 31.3a10.28 10.28 0 0013.71-4.76l30.58-60.87a10.27 10.27 0 00-4.53-13.79c-17.2-8.91-51.5-26.62-71.49-36.77-67.77-34.34-125.66-31.94-193 45.13z" fill="url(#confluence-a)"/>
      <path d="M246.11 58.24c3.23-5.22 6.78-11.18 9.26-15.87a10.28 10.28 0 00-3.78-14.06L188.5-.44a10.27 10.27 0 00-14.18 3.37c-2.17 3.65-5 8.47-8.08 13.55-21.45 35.65-43.25 31.32-82.33 11.76L21.38-3.06A10.28 10.28 0 007.67 1.7L-22.91 62.57a10.27 10.27 0 004.53 13.79c17.2 8.91 51.5 26.62 71.49 36.77 67.77 34.34 125.66 31.94 193-45.13z" fill="url(#confluence-b)" transform="translate(2.46 2.46)"/>
    </svg>
  )
}

// Linear Icon
export function LinearIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.225 61.527a50.372 50.372 0 0 0 37.248 37.248L1.225 61.527Z" fill="#5E6AD2"/>
      <path d="M.027 46.627a50.217 50.217 0 0 0 .942 10.528l42.876 42.876c3.504.627 7.08.969 10.732.969 2.466 0 4.897-.179 7.283-.523L1.073 39.69A50.29 50.29 0 0 0 .027 46.627Z" fill="#5E6AD2"/>
      <path d="M2.636 34.142 65.858 97.364a50.01 50.01 0 0 0 13.27-5.29L6.456 19.403a50.014 50.014 0 0 0-3.82 14.739Z" fill="#5E6AD2"/>
      <path d="M9.194 15.161l75.645 75.645a50.07 50.07 0 0 0 9.248-9.248L18.442 5.913a50.071 50.071 0 0 0-9.248 9.248Z" fill="#5E6AD2"/>
      <path d="M23.117 4.07 95.929 76.882a50.014 50.014 0 0 0 3.82-14.739L62.502.395a50.218 50.218 0 0 0-9.83-.392 50.216 50.216 0 0 0-29.555 4.068Z" fill="#5E6AD2"/>
      <path d="M44.147.274 99.726 55.853a50.37 50.37 0 0 0-3.98-17.426L61.573.256A50.32 50.32 0 0 0 44.147.274Z" fill="#5E6AD2"/>
      <path d="M72.467 2.21 97.79 27.533a50.226 50.226 0 0 0-4.984-9.68L82.147 7.194a50.226 50.226 0 0 0-9.68-4.984Z" fill="#5E6AD2"/>
    </svg>
  )
}

// Asana Icon
export function AsanaIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="asana-a" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB900"/>
          <stop offset="100%" stopColor="#F95353"/>
        </radialGradient>
      </defs>
      <circle cx="256" cy="130" r="114" fill="url(#asana-a)"/>
      <circle cx="114" cy="372" r="114" fill="url(#asana-a)"/>
      <circle cx="398" cy="372" r="114" fill="url(#asana-a)"/>
    </svg>
  )
}

// Dropbox Icon
export function DropboxIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 218" xmlns="http://www.w3.org/2000/svg">
      <path d="M63.995 0L0 40.771l63.995 40.772L128 40.771 63.995 0zM192.005 0L128 40.771l64.005 40.772L256 40.771 192.005 0zM0 122.321l63.995 40.772L128 122.321 63.995 81.543 0 122.321zM192.005 81.543L128 122.321l64.005 40.772L256 122.321l-63.995-40.778zM64.006 176.771L128.01 217.6l64.006-40.829-64.005-40.771-64.005 40.771z" fill="#0061FF"/>
    </svg>
  )
}

// Generic connector icon for future use
export function ConnectorIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
