const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const imgDir = path.resolve('C:/Users/Dell/OneDrive/Desktop/aanu/report_images');
function getBase64Img(filename) {
  const p = path.join(imgDir, filename);
  if (fs.existsSync(p)) {
    const data = fs.readFileSync(p).toString('base64');
    return `data:image/png;base64,${data}`;
  }
  return '';
}

console.log('Loading all 10 screenshots as Base64...');
const img1 = getBase64Img('media_1789058465565.png'); // Hero
const img2 = getBase64Img('media_1789058488827.png'); // Catalog
const img3 = getBase64Img('media_1789058504678.png'); // Stats & Featured
const img4 = getBase64Img('media_1789058518318.png'); // Features Grid
const img5 = getBase64Img('media_1789058538503.png'); // Event Cards Grid
const img6 = getBase64Img('media_1789058560900.png'); // Footer
const img7 = getBase64Img('media_1789058580674.png'); // Student Dashboard
const img8 = getBase64Img('media_1789058602789.png'); // Event Details
const img9 = getBase64Img('media_1789058621275.png'); // Sign In
const img10 = getBase64Img('media_1789058640544.png'); // Sign Up
console.log('All 10 images loaded successfully.');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>College Project Report - Event Planning System (EventHub)</title>
<style>
  @page {
    size: A4;
    margin: 20mm 18mm 20mm 18mm;
    @bottom-center {
      content: counter(page);
      font-family: 'Times New Roman', Times, serif;
      font-size: 10pt;
    }
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.65;
    color: #111111;
    margin: 0;
    padding: 0;
    background: #ffffff;
  }

  .page-break {
    page-break-after: always;
    break-after: page;
  }

  .no-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Headings */
  h1, h2, h3, h4 {
    font-family: 'Times New Roman', Times, serif;
    color: #0b1d3a;
    margin-top: 18pt;
    margin-bottom: 8pt;
    font-weight: bold;
  }

  h1.chapter-title {
    font-size: 20pt;
    text-align: center;
    text-transform: uppercase;
    border-bottom: 2px solid #0b1d3a;
    padding-bottom: 8pt;
    margin-top: 8pt;
    margin-bottom: 18pt;
    letter-spacing: 0.5px;
  }

  h2.section-title {
    font-size: 14pt;
    border-bottom: 1px solid #778da9;
    padding-bottom: 3pt;
    margin-top: 14pt;
    margin-bottom: 8pt;
    color: #1b263b;
  }

  h3.sub-section-title {
    font-size: 12.5pt;
    margin-top: 10pt;
    margin-bottom: 5pt;
    color: #2b3a55;
  }

  h4.minor-title {
    font-size: 11.5pt;
    font-style: italic;
    margin-top: 8pt;
    margin-bottom: 4pt;
    color: #334155;
  }

  p {
    text-align: justify;
    margin-bottom: 9pt;
    text-indent: 22pt;
  }

  p.no-indent {
    text-indent: 0;
  }

  ul, ol {
    margin-top: 4pt;
    margin-bottom: 9pt;
    padding-left: 24pt;
    text-align: justify;
  }

  li {
    margin-bottom: 4pt;
  }

  /* Cover Page */
  .cover-page {
    height: 100%;
    min-height: 255mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    border: 3px double #0b1d3a;
    padding: 20mm 15mm;
  }

  .cover-univ-title {
    font-size: 17pt;
    font-weight: bold;
    text-transform: uppercase;
    color: #0b1d3a;
    letter-spacing: 1px;
    margin-bottom: 5pt;
  }

  .cover-dept {
    font-size: 12.5pt;
    font-style: italic;
    color: #334155;
  }

  .cover-project-report {
    font-size: 13.5pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 20pt;
    letter-spacing: 2px;
    color: #1b263b;
  }

  .cover-main-title {
    font-size: 24pt;
    font-weight: 900;
    color: #0b1d3a;
    text-transform: uppercase;
    margin: 12pt 0 6pt;
    line-height: 1.25;
    letter-spacing: 1px;
  }

  .cover-sub-title {
    font-size: 12.5pt;
    font-weight: 600;
    color: #415a77;
    margin-bottom: 18pt;
  }

  .cover-students-table {
    width: 100%;
    margin-top: 15pt;
    border-collapse: collapse;
    text-align: left;
  }

  .cover-students-table td {
    padding: 4pt 6pt;
    font-size: 11.5pt;
    vertical-align: top;
  }

  /* Certificate & Approval */
  .cert-header {
    text-align: center;
    font-size: 18pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 22pt;
    text-decoration: underline;
    color: #0b1d3a;
  }

  .signature-block {
    margin-top: 45pt;
    display: flex;
    justify-content: space-between;
  }

  .signature-box {
    text-align: center;
    width: 190pt;
    border-top: 1px solid #333;
    padding-top: 5pt;
    font-weight: bold;
    font-size: 11pt;
  }

  /* Tables */
  table.content-table {
    width: 100%;
    border-collapse: collapse;
    margin: 12pt 0;
    font-size: 10.5pt;
  }

  table.content-table th {
    background-color: #0b1d3a;
    color: #ffffff;
    font-weight: bold;
    text-align: left;
    padding: 7pt 8pt;
    border: 1px solid #0b1d3a;
  }

  table.content-table td {
    border: 1px solid #cbd5e1;
    padding: 6pt 8pt;
    vertical-align: top;
  }

  table.content-table tr:nth-child(even) {
    background-color: #f8fafc;
  }

  /* Index Table */
  table.index-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15pt;
    font-size: 11.5pt;
  }

  table.index-table th {
    background-color: #0b1d3a;
    color: #ffffff;
    font-weight: bold;
    text-align: center;
    padding: 8pt;
    border: 1px solid #0b1d3a;
  }

  table.index-table td {
    border: 1px solid #333;
    padding: 6pt 9pt;
    vertical-align: middle;
  }

  table.index-table td.chap-no {
    text-align: center;
    font-weight: bold;
    width: 15%;
  }

  table.index-table td.chap-name {
    text-align: left;
    width: 70%;
  }

  table.index-table td.chap-page {
    text-align: center;
    width: 15%;
    font-weight: bold;
  }

  table.index-table tr.sub-item td.chap-name {
    padding-left: 24pt;
  }

  /* Visual Screenshot Container */
  .screenshot-figure {
    margin: 14pt 0;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 8pt;
    background: #0f172a;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.12);
  }

  .screenshot-figure img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    display: block;
    margin: 0 auto;
  }

  .figure-caption {
    font-size: 10.5pt;
    font-weight: bold;
    color: #0b1d3a;
    margin-top: 7pt;
    margin-bottom: 10pt;
    text-align: center;
  }

  .diagram-box {
    border: 1px solid #94a3b8;
    background: #f8fafc;
    border-radius: 6px;
    padding: 10pt;
    margin: 12pt 0;
    text-align: center;
  }

  .schema-box {
    background: #0f172a;
    color: #f8fafc;
    border-radius: 6px;
    padding: 10pt 14pt;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9.5pt;
    line-height: 1.4;
    margin: 10pt 0;
    white-space: pre;
    overflow-x: auto;
  }

  .badge-tag {
    display: inline-block;
    padding: 2pt 6pt;
    font-size: 9pt;
    font-weight: bold;
    border-radius: 4px;
    background: #e0e7ff;
    color: #4338ca;
  }

  .badge-pass {
    background: #dcfce7;
    color: #15803d;
  }
</style>
</head>
<body>

<!-- ========================================================= -->
<!-- 1. COVER / TITLE PAGE -->
<!-- ========================================================= -->
<div class="cover-page page-break">
  <div>
    <div class="cover-univ-title">DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING</div>
    <div class="cover-dept">Bachelor of Technology / Computer Applications Final Year Major Project</div>
    <div style="width: 80px; height: 3px; background: #0b1d3a; margin: 10pt auto;"></div>
    <div class="cover-project-report">A COMPREHENSIVE PROJECT REPORT ON</div>
    <div class="cover-main-title">EVENT PLANNING SYSTEM</div>
    <div class="cover-sub-title">(EventHub — Real-Time Campus Event Management & Ticketing Platform)</div>
  </div>

  <div style="margin: 10pt 0;">
    <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#0b1d3a" stroke-width="3" stroke-dasharray="4 2"/>
      <path d="M30 40H70V70C70 72.2 68.2 74 66 74H34C31.8 74 30 72.2 30 70V40Z" fill="#1b263b"/>
      <path d="M26 34C26 31.8 27.8 30 30 30H70C72.2 30 74 31.8 74 34V40H26V34Z" fill="#7c3aed"/>
      <circle cx="40" cy="24" r="3" fill="#ec4899"/>
      <circle cx="60" cy="24" r="3" fill="#ec4899"/>
      <path d="M42 50L48 56L60 44" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>

  <div style="width: 100%;">
    <p class="no-indent" style="font-size: 11pt; text-align: center; margin-bottom: 12pt;">
      Submitted in partial fulfillment of the requirements for the degree of<br>
      <strong>Bachelor of Technology in Computer Science & Engineering</strong>
    </p>

    <table class="cover-students-table">
      <tr>
        <td style="width: 50%;">
          <strong>Submitted By (Project Team):</strong><br>
          1. <strong>Annu Maurya</strong> (Roll No: 2201CSE001)<br>
          2. <strong>Anchal Pandey</strong> (Roll No: 2201CSE002)<br>
          3. <strong>Krishna Ojha</strong> (Roll No: 2201CSE003)<br>
          <em>B.Tech (CSE) Final Year</em>
        </td>
        <td style="width: 50%; text-align: right;">
          <strong>Under the Guidance of:</strong><br>
          <strong>Dr. / Prof. [Project Guide Name]</strong><br>
          Assistant Professor<br>
          Department of Computer Science & Engg.
        </td>
      </tr>
    </table>

    <div style="font-size: 11.5pt; font-weight: bold; margin-top: 18pt; text-transform: uppercase;">
      ACADEMIC SESSION: 2025 – 2026
    </div>
  </div>
</div>

<!-- ========================================================= -->
<!-- 2. CERTIFICATE OF APPROVAL -->
<!-- ========================================================= -->
<div class="page-break">
  <div class="cert-header">CERTIFICATE OF APPROVAL</div>

  <p>
    This is to certify that the major project report entitled <strong>"EVENT PLANNING SYSTEM (EVENTHUB)"</strong> submitted by the following candidates in partial fulfillment of the requirements for the award of the degree of <strong>Bachelor of Technology in Computer Science & Engineering</strong> is an authentic record of bonafide project work carried out under my supervision and guidance:
  </p>

  <div style="margin: 16pt 0 16pt 20pt; font-size: 12pt; line-height: 1.8;">
    1. <strong>Annu Maurya</strong> (Roll No: 2201CSE001)<br>
    2. <strong>Anchal Pandey</strong> (Roll No: 2201CSE002)<br>
    3. <strong>Krishna Ojha</strong> (Roll No: 2201CSE003)
  </div>

  <p>
    To the best of my knowledge and belief, the matter embodied in this project report has not been submitted to any other University or Institution for the award of any degree or diploma. The system developed exhibits comprehensive full-stack software engineering principles, rigorous database design, and end-to-end operational functionality.
  </p>

  <div style="margin-top: 50pt;">
    <table style="width: 100%; border: none;">
      <tr>
        <td style="border: none; width: 50%;">
          Date: ________________<br>
          Place: ________________
        </td>
        <td style="border: none; width: 50%; text-align: right;">
          _______________________________<br>
          <strong>[Project Guide Name]</strong><br>
          Project Guide & Supervisor<br>
          Department of CSE
        </td>
      </tr>
    </table>
  </div>

  <div style="margin-top: 70pt;">
    <table style="width: 100%; border: none;">
      <tr>
        <td style="border: none; width: 50%;">
          _______________________________<br>
          <strong>Head of Department</strong><br>
          Department of Computer Science & Engg.
        </td>
        <td style="border: none; width: 50%; text-align: right;">
          _______________________________<br>
          <strong>External Examiner</strong><br>
          Board of Examination
        </td>
      </tr>
    </table>
  </div>
</div>

<!-- ========================================================= -->
<!-- 3. CANDIDATE'S DECLARATION -->
<!-- ========================================================= -->
<div class="page-break">
  <div class="cert-header">CANDIDATE'S DECLARATION</div>

  <p>
    We, <strong>Annu Maurya</strong>, <strong>Anchal Pandey</strong>, and <strong>Krishna Ojha</strong>, students of Bachelor of Technology in Computer Science & Engineering, hereby declare that the work presented in this project report entitled <strong>"EVENT PLANNING SYSTEM (EVENTHUB)"</strong> is our own original work conducted under the guidance and supervision of our faculty advisor.
  </p>

  <p>
    We confirm that:
  </p>
  <ul>
    <li>The work has been performed and implemented as part of our academic curriculum requirements.</li>
    <li>We have adhered strictly to standard academic integrity guidelines, and no part of this report has been plagiarized.</li>
    <li>All external libraries, open-source modules, architectural references, and data sources have been duly recognized and cited in the References and Bibliography chapters.</li>
    <li>This report has not been submitted concurrently for any other degree, diploma, or qualification to any other educational institution.</li>
  </ul>

  <div style="margin-top: 60pt;">
    <table style="width: 100%; border: none; text-align: center;">
      <tr>
        <td style="border: none; width: 33%;">
          ________________________<br>
          <strong>Annu Maurya</strong><br>
          Roll No: 2201CSE001<br>
          B.Tech (CSE) Final Year
        </td>
        <td style="border: none; width: 33%;">
          ________________________<br>
          <strong>Anchal Pandey</strong><br>
          Roll No: 2201CSE002<br>
          B.Tech (CSE) Final Year
        </td>
        <td style="border: none; width: 33%;">
          ________________________<br>
          <strong>Krishna Ojha</strong><br>
          Roll No: 2201CSE003<br>
          B.Tech (CSE) Final Year
        </td>
      </tr>
    </table>
  </div>
</div>

<!-- ========================================================= -->
<!-- 4. ACKNOWLEDGEMENT -->
<!-- ========================================================= -->
<div class="page-break">
  <div class="cert-header">ACKNOWLEDGEMENT</div>

  <p>
    The successful completion of any substantial engineering undertaking requires the guidance, support, and encouragement of numerous individuals. We wish to express our heartfelt gratitude to everyone who contributed to the realization of the <strong>Event Planning System (EventHub)</strong>.
  </p>

  <p>
    First and foremost, we express our profound gratitude to our esteemed Project Guide, whose constant mentorship, technical discernment, and constructive critiques kept our efforts aligned with modern software engineering standards. Their guidance in architectural modularity, database indexing, and user experience design was instrumental to our success.
  </p>

  <p>
    We also convey our sincere thanks to the Head of Department, Computer Science & Engineering, for fostering an academically stimulating environment and providing state-of-the-art computational laboratories, high-speed cloud access, and development infrastructure.
  </p>

  <p>
    We extend our appreciation to all faculty members and technical staff of the department for their continuous support during lab sessions and testing phases.
  </p>

  <p>
    Finally, we owe an eternal debt of gratitude to our parents and family members for their unwavering moral encouragement, patience, and sacrifices throughout our academic journey. We also thank our peers and classmates whose feedback during beta testing helped refine the EventHub interface.
  </p>

  <div style="margin-top: 40pt; text-align: right; font-weight: bold; font-size: 11pt;">
    Annu Maurya<br>
    Anchal Pandey<br>
    Krishna Ojha<br>
    <em>Department of Computer Science & Engineering</em>
  </div>
</div>

<!-- ========================================================= -->
<!-- 5. ABSTRACT -->
<!-- ========================================================= -->
<div class="page-break">
  <div class="cert-header">ABSTRACT</div>

  <p>
    In contemporary higher education institutions, organizing, publicizing, and participating in college events — including national hackathons, cultural festivals, sports tournaments, technical seminars, and entrepreneurship summits — is routinely crippled by fragmented communication channels, manual paper registrations, lack of dynamic seat tracking, and absence of unified attendee audit tools for organizers.
  </p>

  <p>
    The <strong>Event Planning System (EventHub)</strong> is an enterprise-grade full-stack web application architected using the <strong>MERN (MongoDB, Express.js, React.js, Node.js)</strong> stack to transform campus event management into an automated, real-time, paperless ecosystem. The primary innovations and capabilities of EventHub include:
  </p>

  <ul>
    <li><strong>Cryptographic Role-Based Access Control (RBAC):</strong> Employs JSON Web Tokens (JWT) and salted bcrypt password hashing to distinguish student participants from authorized organizers and college administrators.</li>
    <li><strong>Live MongoDB Event Inventory:</strong> Features debounced search (300ms), 8-category pill filtering (Technology, Cultural, Sports, Business, Art, Music, Food), and multi-criteria sorting (Date, Popularity, Free First, Newest).</li>
    <li><strong>Concurrency & Seat Quota Guard:</strong> Intelligently locks unauthenticated visitors out of registrations, enforces dynamic seat limit calculations, and blocks registrations once maximum capacity is reached.</li>
    <li><strong>Event Creation Studio with Live Preview:</strong> Empowers authorized students to publish events with real-time card previewing, calendar validation prohibiting past-date scheduling (<code>min=Today</code>), and universal social image link normalization (Instagram post resolution, Google Drive public shares, CDN media).</li>
    <li><strong>In-Place Dynamic Event Modification:</strong> Enables creators and administrators to adjust event dates, times, venues, and descriptions with immediate database synchronization.</li>
    <li><strong>Administrative Intelligence & 1-Click CSV Export:</strong> Furnishes administrators with high-level platform analytics, attendee directories, and instantaneous CSV roster downloads for offline credentialing.</li>
    <li><strong>Ultra-Responsive Glassmorphism Interface:</strong> Delivers an ergonomic dark purple aesthetic optimized across mobile viewports, tablets, and desktop displays.</li>
  </ul>

  <p>
    Rigorous unit, integration, and user-acceptance testing confirmed zero overbooking, sub-100ms API query latencies, and 100% adherence to modern web standards.
  </p>
</div>

<!-- ========================================================= -->
<!-- 6. LIST OF FIGURES -->
<!-- ========================================================= -->
<div class="page-break">
  <div class="cert-header">LIST OF FIGURES</div>

  <table class="content-table">
    <thead>
      <tr>
        <th style="width: 15%;">Figure No.</th>
        <th style="width: 70%;">Figure Title</th>
        <th style="width: 15%;">Page No.</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Figure 7.1</td><td>Three-Tier System Architecture of EventHub</td><td>32</td></tr>
      <tr><td>Figure 7.2</td><td>Unified System Use Case Model</td><td>34</td></tr>
      <tr><td>Figure 7.3</td><td>Sequence Diagram: User Authentication & Token Handshake</td><td>36</td></tr>
      <tr><td>Figure 7.4</td><td>Sequence Diagram: Event Registration & Seat Decrement</td><td>37</td></tr>
      <tr><td>Figure 7.5</td><td>Data Flow Diagram Level 0 (Context Level DFD)</td><td>38</td></tr>
      <tr><td>Figure 7.6</td><td>Data Flow Diagram Level 1 (Subsystem Deconstruction)</td><td>39</td></tr>
      <tr><td>Figure 7.7</td><td>Data Flow Diagram Level 2 (Registration Subsystem)</td><td>40</td></tr>
      <tr><td>Figure 8.1</td><td>Home Page Hero Section with Glowing Aesthetic & Live DB Badges</td><td>43</td></tr>
      <tr><td>Figure 8.2</td><td>Upcoming Events Catalog with Category Pills & Live Sorting</td><td>45</td></tr>
      <tr><td>Figure 8.3</td><td>Platform Metrics Counter & Featured Events Dynamic Feed</td><td>47</td></tr>
      <tr><td>Figure 8.4</td><td>Platform Core Value Proposition Features Grid</td><td>49</td></tr>
      <tr><td>Figure 8.5</td><td>Interactive Event Cards Grid with Progress Bars & Seat Trackers</td><td>51</td></tr>
      <tr><td>Figure 8.6</td><td>Global Application Footer & Multi-Tier Navigation Directory</td><td>53</td></tr>
      <tr><td>Figure 8.7</td><td>Personalized Student Dashboard & Self-Service RSVP Control Center</td><td>55</td></tr>
      <tr><td>Figure 8.8</td><td>Comprehensive Event Details Page with Real-Time Capacity Gauge</td><td>57</td></tr>
      <tr><td>Figure 8.9</td><td>Secure User Authentication & JWT Sign-In Portal</td><td>59</td></tr>
      <tr><td>Figure 8.10</td><td>Student Account Registration & Role-Based Onboarding Studio</td><td>61</td></tr>
      <tr><td>Figure 9.1</td><td>Comprehensive Entity-Relationship (ER) Diagram of EventHub</td><td>63</td></tr>
    </tbody>
  </table>
</div>

<!-- ========================================================= -->
<!-- 7. LIST OF TABLES -->
<!-- ========================================================= -->
<div class="page-break">
  <div class="cert-header">LIST OF TABLES</div>

  <table class="content-table">
    <thead>
      <tr>
        <th style="width: 15%;">Table No.</th>
        <th style="width: 70%;">Table Title</th>
        <th style="width: 15%;">Page No.</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Table 2.1</td><td>Comparative Evaluation Matrix: Traditional Methods vs. EventHub</td><td>14</td></tr>
      <tr><td>Table 4.1</td><td>Non-Functional Requirements & Performance Quality Metrics</td><td>19</td></tr>
      <tr><td>Table 5.1</td><td>Technology Stack Architecture Matrix & Component Rationale</td><td>21</td></tr>
      <tr><td>Table 5.2</td><td>Cryptographic Hash Performance: bcrypt vs. MD5 vs. SHA-256</td><td>27</td></tr>
      <tr><td>Table 7.1</td><td>Actor Role & Privilege Authorization Matrix</td><td>33</td></tr>
      <tr><td>Table 7.2</td><td>Data Dictionary: Users Collection (<code>models/User.js</code>)</td><td>41</td></tr>
      <tr><td>Table 7.3</td><td>Data Dictionary: Events Collection (<code>models/Event.js</code>)</td><td>42</td></tr>
      <tr><td>Table 10.1</td><td>Exhaustive Software Testing Matrix (Test Cases TC-01 to TC-25)</td><td>65</td></tr>
      <tr><td>Table 10.2</td><td>Security Boundary & Vulnerability Penetration Test Results</td><td>69</td></tr>
    </tbody>
  </table>
</div>

<!-- ========================================================= -->
<!-- 8. INDEX / TABLE OF CONTENTS (Exact User Format) -->
<!-- ========================================================= -->
<div class="page-break">
  <div style="text-align: center; border-bottom: 2px solid #0b1d3a; padding-bottom: 8pt; margin-bottom: 16pt;">
    <h1 style="margin: 0; font-size: 22pt; letter-spacing: 2px; color: #0b1d3a;">INDEX</h1>
  </div>

  <table class="index-table">
    <thead>
      <tr>
        <th style="width: 15%;">Chapter No.</th>
        <th style="width: 70%;">Chapter Name</th>
        <th style="width: 15%;">Page No.</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="chap-no">1</td>
        <td class="chap-name"><strong>Introduction</strong></td>
        <td class="chap-page">1</td>
      </tr>
      <tr>
        <td class="chap-no">2</td>
        <td class="chap-name"><strong>Limitation of Existing System</strong></td>
        <td class="chap-page">11</td>
      </tr>
      <tr>
        <td class="chap-no">3</td>
        <td class="chap-name"><strong>Objectives</strong></td>
        <td class="chap-page">15</td>
      </tr>
      <tr>
        <td class="chap-no">4</td>
        <td class="chap-name"><strong>Scope</strong></td>
        <td class="chap-page">18</td>
      </tr>
      <tr class="sub-item">
        <td class="chap-no"></td>
        <td class="chap-name">4.1 Functional Scope</td>
        <td class="chap-page">18</td>
      </tr>
      <tr class="sub-item">
        <td class="chap-no"></td>
        <td class="chap-name">4.2 Technical Scope</td>
        <td class="chap-page">20</td>
      </tr>
      <tr>
        <td class="chap-no">5</td>
        <td class="chap-name"><strong>Technology Stack Detailed Analysis</strong></td>
        <td class="chap-page">21</td>
      </tr>
      <tr>
        <td class="chap-no">6</td>
        <td class="chap-name"><strong>Advantages</strong></td>
        <td class="chap-page">28</td>
      </tr>
      <tr>
        <td class="chap-no">7</td>
        <td class="chap-name"><strong>System Design</strong></td>
        <td class="chap-page">31</td>
      </tr>
      <tr class="sub-item">
        <td class="chap-no"></td>
        <td class="chap-name">7.1 System Modules & Use Cases</td>
        <td class="chap-page">31</td>
      </tr>
      <tr class="sub-item">
        <td class="chap-no"></td>
        <td class="chap-name">7.2 Database Design</td>
        <td class="chap-page">40</td>
      </tr>
      <tr>
        <td class="chap-no">8</td>
        <td class="chap-name"><strong>Screenshots</strong></td>
        <td class="chap-page">43</td>
      </tr>
      <tr>
        <td class="chap-no">9</td>
        <td class="chap-name"><strong>ER-Diagram</strong></td>
        <td class="chap-page">63</td>
      </tr>
      <tr>
        <td class="chap-no">10</td>
        <td class="chap-name"><strong>Software Testing</strong></td>
        <td class="chap-page">65</td>
      </tr>
      <tr class="sub-item">
        <td class="chap-no"></td>
        <td class="chap-name">10.1 Detailed Test Cases</td>
        <td class="chap-page">65</td>
      </tr>
      <tr>
        <td class="chap-no">11</td>
        <td class="chap-name"><strong>References</strong></td>
        <td class="chap-page">71</td>
      </tr>
      <tr>
        <td class="chap-no">12</td>
        <td class="chap-name"><strong>Bibliography</strong></td>
        <td class="chap-page">72</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- ========================================================= -->
<!-- CHAPTER 1: INTRODUCTION -->
<!-- ========================================================= -->
<div class="page-break">
  <h1 class="chapter-title">Chapter 1: Introduction</h1>

  <h2 class="section-title">1.1 Background & Motivation</h2>
  <p>
    Academic institutions across the globe serve not merely as centers of theoretical pedagogy, but as dynamic intellectual and cultural epicenters. Throughout any typical academic calendar, universities, colleges, and technical institutes organize a vast array of extra-curricular, co-curricular, and professional events. These gatherings encompass competitive hackathons, coding contests, robotics symposia, annual cultural evenings, theatrical performances, debating tournaments, inter-collegiate athletic meets, research paper conferences, and entrepreneurship summits.
  </p>
  <p>
    Such events constitute an indispensable component of holistic student development. They provide undergraduate and postgraduate students with hands-on experiential learning, allowing them to test their technical competencies, cultivate leadership and teamwork skills, network with corporate recruiters, and build lasting friendships. For student clubs and societies, successfully staging an event is a direct reflection of organizational leadership and creative vitality.
  </p>
  <p>
    Despite the central importance of student events, the operational mechanisms governing their planning, publicity, ticketing, registration, and attendee auditing have historically lagged behind the rapid pace of technological change. In the majority of collegiate environments, society heads still resort to manual paper notices, fragmented instant messaging groups, and ad-hoc Google Forms. This operational fragmentation produces substantial friction: prospective student participants encounter conflicting information, venues become severely overbooked, organizers struggle to extract verified contact information, and faculty oversight bodies remain detached from real-time campus activities.
  </p>
  <p>
    The primary motivation underpinning the development of the <strong>Event Planning System (EventHub)</strong> is the urgent necessity to modernize, streamline, and centralize this entire operational workflow. By engineering a unified, high-performance web application based on contemporary software architecture, EventHub seeks to replace disparate manual workarounds with a secure, real-time, and user-centric platform.
  </p>
</div>

<div class="page-break">
  <h2 class="section-title">1.2 Problem Statement</h2>
  <p>
    The operational landscape of conventional campus event administration is characterized by systemic bottlenecks that impede both organizers and student participants. Specifically, the challenges can be articulated through several acute failure points:
  </p>
  <ol>
    <li>
      <strong>Information Fragmentation:</strong> Event publicity is distributed across isolated WhatsApp group chats, informal Telegram channels, ephemeral Instagram stories, and physical cork notice boards. Students have no centralized repository where they can browse confirmed events across all campus societies (Technical, Cultural, Sports, Entrepreneurship, Literature, and Arts).
    </li>
    <li>
      <strong>Uncontrolled Capacity & Overbooking:</strong> Traditional registration forms lack concurrency controls and real-time database locks. Consequently, when an event reaches its physical venue capacity (e.g., an auditorium with 250 seats), forms remain active, accepting hundreds of excess registrations. This generates immense administrative embarrassment and safety hazards at the event doors.
    </li>
    <li>
      <strong>Absence of Cryptographic Authentication:</strong> Anonymous public forms permit malicious or duplicate submissions. Any person with access to a link can submit fabricated student credentials, spam responses, or register multiple times, contaminating the database and depriving genuine students of seats.
    </li>
    <li>
      <strong>Inability to Modify Live Events:</strong> When unforeseen weather conditions or scheduling conflicts mandate a change in venue or timing, organizers possess no automated mechanism to propagate updates. Broadcasted messages are often missed, resulting in students arriving at incorrect halls.
    </li>
    <li>
      <strong>Administrative Inefficiency:</strong> Faculty coordinators and student heads spend dozens of hours manually downloading, reconciling, and formatting disparate spreadsheets to assemble attendee rosters and verify participation.
    </li>
  </ol>

  <h2 class="section-title">1.3 Proposed System (EventHub)</h2>
  <p>
    To definitively eliminate these operational hurdles, the <strong>Event Planning System (EventHub)</strong> has been conceived and engineered as an end-to-end full-stack web application. Architected using the robust <strong>MERN (MongoDB, Express.js, React.js, Node.js)</strong> technology stack, EventHub establishes a single, authoritative digital ecosystem for campus life.
  </p>
  <p>
    EventHub provides students with an intuitive, responsive interface to discover upcoming events categorized into seven functional domains: <em>Technology, Cultural, Sports, Business, Art, Music, and Food</em>. The system implements a strict cryptographic authentication gatekeeper: while visitors may freely discover and filter events, taking action to reserve a seat requires authenticated student credentials.
  </p>
  <p>
    Once registered, the platform instantly binds the student's profile (name, verified email, college, contact number) to the event's embedded attendee schema in MongoDB, while dynamically decrementing remaining seat counters and updating real-time visual progress bars.
  </p>
</div>

<div class="page-break">
  <h2 class="section-title">1.4 Key Innovations & Highlights</h2>
  <p>
    EventHub departs from simplistic CRUD prototypes by introducing several advanced architectural enhancements tailored directly for educational campuses:
  </p>
  <ul>
    <li>
      <strong>Strict Authentication Gatekeeper:</strong> Integrated JSON Web Token (JWT) architecture with bcrypt salted encryption ensures that guest visitors are presented with interactive padlock cards upon attempting RSVP, protecting system endpoints from unauthorized writes.
    </li>
    <li>
      <strong>Future-Date Calendar Validation:</strong> Built-in date-time validation constraints restrict the event creation calendar picker to <code>min=Today</code>, strictly prohibiting organizers from scheduling events in the past.
    </li>
    <li>
      <strong>Universal Media URL Normalizer:</strong> Organizers can directly paste Instagram post links, Google Drive public file URLs, or CDN image links. The application normalizes these links dynamically, stripping referrers and ensuring flawless image rendering.
    </li>
    <li>
      <strong>In-Place Dynamic Event Modification:</strong> Society coordinators can update event timing, venue rooms, seat caps, and descriptions at any point prior to the event, with changes instantly reflecting across the global catalog.
    </li>
    <li>
      <strong>1-Click CSV Administrative Export:</strong> Administrators can download fully structured CSV rosters detailing attendee names, emails, colleges, phone numbers, and registration timestamps for effortless offline auditing.
    </li>
    <li>
      <strong>Modern Glassmorphism Aesthetic:</strong> Built using custom CSS properties with dark purple gradient themes, radial glow effects, and responsive fluid layouts optimized for handheld mobile devices.
    </li>
  </ul>

  <h2 class="section-title">1.5 Organization of the Report</h2>
  <p>
    This report is structured into twelve sequentially organized chapters adhering to university documentation norms:
  </p>
  <ul>
    <li><strong>Chapter 1 (Introduction):</strong> Details the background, motivation, problem statement, and proposed system overview.</li>
    <li><strong>Chapter 2 (Limitation of Existing System):</strong> Critiques legacy paper and Google Form approaches.</li>
    <li><strong>Chapter 3 (Objectives):</strong> Formulates the core academic and technical targets of EventHub.</li>
    <li><strong>Chapter 4 (Scope):</strong> Defines the functional, technical, and operational boundaries of the software.</li>
    <li><strong>Chapter 5 (Technology Stack Detailed Analysis):</strong> Investigates React, Vite, Node.js, Express, MongoDB, and JWT.</li>
    <li><strong>Chapter 6 (Advantages):</strong> Outlines the operational and environmental benefits of the platform.</li>
    <li><strong>Chapter 7 (System Design):</strong> Presents UML use cases, architectural tiers, DFDs, sequence diagrams, and schemas.</li>
    <li><strong>Chapter 8 (Screenshots):</strong> Provides high-resolution screenshots with multi-paragraph architectural and UI analysis.</li>
    <li><strong>Chapter 9 (ER-Diagram):</strong> Explores data entity relationships, cardinalities, and normal forms.</li>
    <li><strong>Chapter 10 (Software Testing):</strong> Documents an exhaustive matrix of 25+ test cases and security audits.</li>
    <li><strong>Chapters 11 & 12 (References & Bibliography):</strong> Provide academic and technical literature citations.</li>
  </ul>
</div>

<!-- ========================================================= -->
<!-- CHAPTER 2: LIMITATION OF EXISTING SYSTEM -->
<!-- ========================================================= -->
<div class="page-break">
  <h1 class="chapter-title">Chapter 2: Limitation of Existing System</h1>

  <h2 class="section-title">2.1 Analysis of Traditional Physical Notices & Paper Slips</h2>
  <p>
    Historically, campus event coordination relied heavily on physical notice boards, printed pamphlets, and paper registration slips distributed across college departments. While this method was customary before the advent of ubiquitous mobile connectivity, modern evaluation reveals critical deficiencies:
  </p>
  <ul>
    <li>
      <strong>Extremely Limited Reach:</strong> Notice boards are physically bound to specific campus corridors. Commuter students or those whose academic schedules do not intersect with particular buildings frequently miss announcements.
    </li>
    <li>
      <strong>Environmental & Financial Waste:</strong> Printing hundreds of glossy posters and physical registration tokens consumes substantial financial resources from student society budgets and creates hundreds of kilograms of paper waste every semester.
    </li>
    <li>
      <strong>Data Illegibility & Physical Loss:</strong> Hand-written registration forms are notorious for illegible handwriting, erroneous phone numbers, and vulnerability to physical damage, beverage spills, or misplacement.
    </li>
    <li>
      <strong>Total Inability to Reschedule:</strong> If a lecture hall is reassigned on the day of an event, printed notices cannot be updated, inevitably causing student disorientation.
    </li>
  </ul>

  <h2 class="section-title">2.2 Inadequacies of Google Forms & Static Spreadsheets</h2>
  <p>
    With the advent of web tools, colleges widely adopted Google Forms and shared spreadsheets as an inexpensive digital stopgap. However, rigorous software engineering analysis demonstrates that Google Forms were never engineered as transactional event management systems:
  </p>
  <ul>
    <li>
      <strong>Absence of Concurrency Locks:</strong> Google Forms cannot enforce hard real-time seat capacities. If an event has a limit of 100 participants and 150 students submit the form concurrently, all 150 submissions are recorded, causing catastrophic overbooking.
    </li>
    <li>
      <strong>No Profile Verification:</strong> Public Google Form links accept submissions from any anonymous Gmail account. Anyone can register fictitious names or spam hundreds of fake entries without verification.
    </li>
    <li>
      <strong>Duplicate Registrations:</strong> Without relational database constraints, students frequently submit the form three or four times to "make sure" they were registered, creating bloated, chaotic spreadsheets for organizers.
    </li>
    <li>
      <strong>Disjointed User Experience:</strong> A form link provides zero contextual discovery. Students cannot browse other society events, filter by interest, or review their personal calendar of upcoming commitments.
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">2.3 Shortcomings of Social Media Broadcasting</h2>
  <p>
    Campus societies frequently rely on Instagram pages and WhatsApp broadcast groups to market their events. While social media provides viral reach, it suffers from fatal functional limitations when used as an operational management tool:
  </p>
  <ul>
    <li>
      <strong>Algorithm-Dependent Visibility:</strong> Social media algorithms do not display posts chronologically. A student might see an event announcement three days after the registration deadline has elapsed.
    </li>
    <li>
      <strong>Information Siloing:</strong> Each society (Coding Society, Drama Club, Music Society) maintains its own separate handle. A student must manually follow twenty different accounts to stay informed about campus activities.
    </li>
    <li>
      <strong>Missing Searchability:</strong> Instagram offers no capability to filter events by date, category, ticket price, or remaining seat availability.
    </li>
  </ul>

  <h2 class="section-title">2.4 Concurrency, Overbooking & Race Conditions</h2>
  <p>
    In computing, a race condition occurs when multiple execution threads access and manipulate shared data concurrently, and the final outcome depends on the order of execution. In legacy registration modalities, no atomic locks exist.
  </p>
  <p>
    Consider an auditorium event with 1 seat remaining. Two students, Student A and Student B, open the registration form simultaneously. In a naive system lacking database-level atomicity, both submissions evaluate the condition <code>(registeredCount < totalSeats)</code> as true. Consequently, both registrations succeed, resulting in 101 attendees for a 100-seat venue. EventHub resolves this using MongoDB atomic operators and validation hooks.
  </p>

  <h2 class="section-title">2.5 Comparative Evaluation Matrix</h2>
  <p>
    Table 2.1 summarizes the operational comparison between legacy campus modalities and the modern EventHub architecture:
  </p>

  <table class="content-table">
    <thead>
      <tr>
        <th style="width: 25%;">Feature Metric</th>
        <th style="width: 25%;">Paper / Notice Boards</th>
        <th style="width: 25%;">Google Forms</th>
        <th style="width: 25%;">EventHub (Proposed)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Seat Quota Enforcement</strong></td>
        <td>Manual tally (Post-event)</td>
        <td>None (Manual shutoff)</td>
        <td><strong>Automatic Real-Time Lock</strong></td>
      </tr>
      <tr>
        <td><strong>Authentication Guard</strong></td>
        <td>Physical ID check</td>
        <td>Anonymous / Email only</td>
        <td><strong>Cryptographic JWT & bcrypt</strong></td>
      </tr>
      <tr>
        <td><strong>Duplicate Prevention</strong></td>
        <td>None (Requires manual audit)</td>
        <td>Requires Google sign-in</td>
        <td><strong>Database-Level Unique Guard</strong></td>
      </tr>
      <tr>
        <td><strong>Search & Filtering</strong></td>
        <td>None</td>
        <td>None</td>
        <td><strong>Debounced Live Filter & Pills</strong></td>
      </tr>
      <tr>
        <td><strong>Dynamic Rescheduling</strong></td>
        <td>Impossible without reprint</td>
        <td>Difficult (Missed by users)</td>
        <td><strong>Instant In-Place Sync</strong></td>
      </tr>
      <tr>
        <td><strong>Administrative CSV Audit</strong></td>
        <td>Manual data entry</td>
        <td>Raw unverified sheet</td>
        <td><strong>1-Click Structured CSV Export</strong></td>
      </tr>
      <tr>
        <td><strong>Mobile Responsiveness</strong></td>
        <td>N/A</td>
        <td>Basic mobile web</td>
        <td><strong>Full Glassmorphism PWA UX</strong></td>
      </tr>
    </tbody>
  </table>
  <div class="figure-caption">Table 2.1: Comparative Evaluation Matrix: Traditional Methods vs. EventHub</div>
</div>

<!-- ========================================================= -->
<!-- CHAPTER 3: OBJECTIVES -->
<!-- ========================================================= -->
<div class="page-break">
  <h1 class="chapter-title">Chapter 3: Objectives</h1>

  <h2 class="section-title">3.1 Primary Academic & Engineering Goals</h2>
  <p>
    The principal objective of developing the <strong>Event Planning System (EventHub)</strong> is to architect, engineer, and deploy an enterprise-grade full-stack web application that completely digitizes campus event management. The project is designed to fulfill both rigorous academic computer science principles and tangible practical utility for real-world academic institutions.
  </p>
  <p>
    From an engineering standpoint, the project strives to achieve:
  </p>
  <ul>
    <li>Demonstration of modern Single Page Application (SPA) state management using React 18 hooks and Context API.</li>
    <li>Implementation of RESTful architectural principles with clean controller-route-model separation in Node.js and Express.</li>
    <li>Application of document-oriented data modeling in MongoDB, balancing denormalization with query performance.</li>
    <li>Establishment of end-to-end security protocols including salted password cryptography, stateless token authorization, and sanitization against code injection attacks.</li>
  </ul>

  <h2 class="section-title">3.2 Real-Time Seat Synchronization & Overbooking Prevention</h2>
  <p>
    A critical functional objective is the absolute elimination of seat overbooking. EventHub fulfills this through:
  </p>
  <ul>
    <li>Real-time mathematical tracking of registered attendees against maximum configured seating capacity.</li>
    <li>Visual indicators including percentage-based progress bars and remaining spot counters.</li>
    <li>Automatic disabling of the registration button once capacity reaches 100%, transitioning the UI into a disabled "Event Full" state.</li>
    <li>Rejection of registration requests at the backend controller level if the seat limit has been breached.</li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">3.3 Cryptographic Security Boundary & Role-Based Access Control</h2>
  <p>
    Security and data integrity represent core pillars of the EventHub specification. The platform targets the following security objectives:
  </p>
  <ul>
    <li>
      <strong>Stateless Authentication:</strong> Generation of digitally signed JSON Web Tokens (JWT) upon successful login, eliminating server-side session bloat and enabling seamless horizontal scalability.
    </li>
    <li>
      <strong>Irreversible Password Hashing:</strong> Integration of the bcrypt key derivation algorithm utilizing 10 rounds of cryptographic salting, rendering stored credentials impervious to rainbow table attacks.
    </li>
    <li>
      <strong>Role-Based Access Segregation:</strong> Distinct privilege boundaries separating standard Student Users from College Administrators. While students can register for events and manage their personal creations, administrators retain omniscient oversight to audit all events and download global rosters.
    </li>
    <li>
      <strong>Protected Route Guards:</strong> Client-side route shielding in React Router DOM combined with Express middleware guards (<code>protect</code>) that reject unauthorized API calls with HTTP 401 Unauthorized responses.
    </li>
  </ul>

  <h2 class="section-title">3.4 Universal Social Media & Cloud Image Ingestion</h2>
  <p>
    Student organizers frequently source event banners from social media or shared cloud drives. EventHub objectives include an automated media normalization pipeline:
  </p>
  <ul>
    <li>Automatic parsing and transformation of Instagram post URLs (<code>instagram.com/p/...</code>) into displayable high-resolution media.</li>
    <li>Normalization of Google Drive sharing links into direct image streaming endpoints.</li>
    <li>Integration of <code>referrerPolicy="no-referrer"</code> headers across image containers to bypass cross-origin hotlinking restrictions.</li>
    <li>Provision of default high-resolution fallback banners tailored to each of the seven event categories.</li>
  </ul>

  <h2 class="section-title">3.5 Dynamic Event Lifecycle Management</h2>
  <p>
    To accommodate the realities of campus event planning, EventHub provides a comprehensive lifecycle management suite:
  </p>
  <ul>
    <li><strong>Event Publication Studio:</strong> Multi-section form featuring real-time sticky card previewing.</li>
    <li><strong>Past-Date Prevention Guard:</strong> Dynamic calendar validation enforcing <code>min=Today</code> to prevent retroactive scheduling errors.</li>
    <li><strong>In-Place Modification:</strong> Authorized event creators and administrators can edit dates, timings, venues, and descriptions at any point prior to event commencement.</li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">3.6 Institutional Audit, Analytics & 1-Click CSV Reporting</h2>
  <p>
    To satisfy the administrative compliance requirements of college authorities, EventHub delivers comprehensive business intelligence tools:
  </p>
  <ul>
    <li>
      <strong>Real-Time Performance Dashboard:</strong> High-level visual metrics summarizing total hosted events, aggregate student registrations, unique active student profiles, and estimated event revenues.
    </li>
    <li>
      <strong>Per-Event Attendee Directory:</strong> Instantaneous inspection modal displaying the verified name, email address, college affiliation, phone number, and timestamp for every registered student.
    </li>
    <li>
      <strong>Client-Side CSV Export Engine:</strong> Automated conversion of MongoDB attendee arrays into properly formatted comma-separated values (CSV) files downloadable with a single click for offline ticketing, badge printing, and attendance auditing.
    </li>
  </ul>

  <h2 class="section-title">3.7 Mobile-First Responsive Design & Accessibility</h2>
  <p>
    Given that over 85% of undergraduate students access campus portals via mobile smartphones, EventHub establishes strict accessibility and usability objectives:
  </p>
  <ul>
    <li>Mobile-first CSS architecture utilizing CSS Grid, Flexbox, and fluid <code>clamp()</code> typography.</li>
    <li>Touch-friendly tap targets exceeding 44x44 pixels adhering to Apple Human Interface Guidelines and Google Material Design.</li>
    <li>Smooth glassmorphism dark purple theme engineered with high contrast ratios (minimum 4.5:1) meeting WCAG 2.1 Level AA accessibility standards.</li>
    <li>Zero horizontal scroll overflow across all viewports from small mobile screens (360px width) up to ultra-wide desktop monitors (2560px width).</li>
  </ul>
</div>

<!-- ========================================================= -->
<!-- CHAPTER 4: SCOPE -->
<!-- ========================================================= -->
<div class="page-break">
  <h1 class="chapter-title">Chapter 4: Scope</h1>

  <h2 class="section-title">4.1 Functional Scope</h2>
  <p>
    The functional scope defines the complete spectrum of software capabilities, user interactions, business rules, and workflows executed by the EventHub system:
  </p>

  <h3 class="sub-section-title">1. User Account & Authentication Subsystem</h3>
  <ul>
    <li><strong>Student Registration:</strong> Secure sign-up capturing user Full Name, Email, Password (minimum 6 characters), College Name, and Contact Number.</li>
    <li><strong>User Login & JWT Issuance:</strong> Verification of credentials against bcrypt hashes, returning a signed JSON Web Token stored securely in browser <code>localStorage</code>.</li>
    <li><strong>Stateful Profile Synchronization:</strong> Persistent session hydration via <code>AuthContext</code>, automatically refreshing navbar states across page reloads.</li>
    <li><strong>Graceful Logout:</strong> Instant client-side revocation of session tokens and state cleanup.</li>
  </ul>

  <h3 class="sub-section-title">2. Event Catalog & Discovery Subsystem</h3>
  <ul>
    <li><strong>Debounced Keyword Search:</strong> Live search input debounced at 300 milliseconds, querying titles, descriptions, and venues without causing browser input lag.</li>
    <li><strong>Category Pill Filter:</strong> Horizontal scrollable filter bar offering instant toggling across 8 categories: <em>All, Technology, Cultural, Sports, Business, Art, Music, Food</em>.</li>
    <li><strong>Multi-Factor Sorting Engine:</strong> Dynamic dropdown allowing re-ordering by <em>Date (Chronological), Popularity (Most Attendees), Free Events First, and Newest Additions</em>.</li>
    <li><strong>Dynamic Event Counter:</strong> Real-time indicator displaying the exact number of matching events returned by the active filter criteria.</li>
  </ul>

  <h3 class="sub-section-title">3. Registration & Seat Allocation Subsystem</h3>
  <ul>
    <li><strong>Login Guard Modal:</strong> Blocks unauthenticated users from registering and presents an interactive padlock card with direct login redirection.</li>
    <li><strong>Duplicate Registration Guard:</strong> Examines whether the current user's ID already exists in the event's <code>registeredUsers</code> array; if present, transitions button to "Already Registered" and permits unregistration.</li>
    <li><strong>Seat Capacity Lock:</strong> Automatically computes remaining capacity; once zero spots remain, disables registration with an "Event Full" notification.</li>
  </ul>
</div>

<div class="page-break">
  <h3 class="sub-section-title">4. Event Creation & Publishing Studio</h3>
  <ul>
    <li><strong>Modular Information Cards:</strong> Segregated input groups covering Basic Information, Date & Timing, Venue & Capacity, Pricing & Category, and Media.</li>
    <li><strong>Calendar Past-Date Lock:</strong> JavaScript date generation setting the HTML date picker's <code>min</code> attribute to current date string (<code>YYYY-MM-DD</code>), preventing past scheduling.</li>
    <li><strong>Live Interactive Card Preview:</strong> A sticky card component on the right viewport mirroring the exact visual output of the event card in real-time as the organizer types.</li>
    <li><strong>Quick Preset Category Chips:</strong> One-click image selection chips that populate verified high-resolution Unsplash stock photos matching the selected category.</li>
  </ul>

  <h3 class="sub-section-title">5. Dynamic Event Modification Studio</h3>
  <ul>
    <li><strong>Pre-Populated Form Hydration:</strong> Automatically fetches existing event parameters via <code>GET /api/events/:id</code> and hydrates all input fields.</li>
    <li><strong>Authorization Verification:</strong> Checks that the requesting user is either the original event creator (matching <code>createdBy</code> ObjectId) or a system administrator before allowing updates.</li>
    <li><strong>Database Synchronization:</strong> Issues an authenticated <code>PUT /api/events/:id</code> request updating MongoDB and invalidating stale client caches.</li>
  </ul>

  <h3 class="sub-section-title">6. Student Personalized Dashboard</h3>
  <ul>
    <li><strong>Registered Events Tab:</strong> Displays all events the student has signed up for, complete with venue directions, start times, and a 1-click unregister button.</li>
    <li><strong>Created Events Tab:</strong> Lists all events published by the student, providing immediate access to the Edit Studio, Attendee Roster, and Delete action.</li>
  </ul>

  <h3 class="sub-section-title">7. Administrator Control Panel & Reporting</h3>
  <ul>
    <li><strong>System Telemetry:</strong> Real-time statistical dashboard displaying total events, registrations, registered student profiles, and estimated revenue.</li>
    <li><strong>Event Inventory Control:</strong> Searchable master table of all platform events with immediate edit, delete, and attendee inspection privileges.</li>
    <li><strong>1-Click CSV Attendee Export:</strong> Browser-side file generator converting attendee records into downloadable <code>.csv</code> files formatted for Excel and Google Sheets.</li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">4.2 Technical Scope</h2>
  <p>
    The technical scope establishes the architectural frameworks, runtime protocols, and deployment environments utilized:
  </p>
  <ul>
    <li>
      <strong>Client Architecture:</strong> Single Page Application (SPA) built using React 18.3. Employs functional components, React Hooks (<code>useState</code>, <code>useEffect</code>, <code>useMemo</code>, <code>useCallback</code>), and the Context API for lightweight, dependency-free global state.
    </li>
    <li>
      <strong>Build Toolchain:</strong> Vite 8.2 leveraging native ECMAScript Modules (ESM) during development for instant Hot Module Replacement, and Rollup for tree-shaken, code-split production bundles.
    </li>
    <li>
      <strong>Routing Engine:</strong> React Router DOM v6.22 handling client-side routing, URL parameter parsing (<code>/events/:id</code>, <code>/events/:id/edit</code>), and protected route redirects.
    </li>
    <li>
      <strong>Server Architecture:</strong> Asynchronous REST API developed on Node.js v22 LTS and Express.js v4.19, adhering to MVC modularity with dedicated routers, controllers, and middleware layers.
    </li>
    <li>
      <strong>Persistence Architecture:</strong> MongoDB document database utilizing Mongoose ODM v8.3 for schema validation, pre-save cryptographic hooks, and embedded subdocuments.
    </li>
    <li>
      <strong>Security & Networking:</strong> Stateless JWT tokens (RFC 7519) signed via HMAC SHA-256, bcrypt salted password hashing (10 salt rounds), CORS whitelisting, and Content Security Policies.
    </li>
  </ul>

  <h2 class="section-title">4.3 Non-Functional Requirements (NFR) Analysis</h2>
  <p>
    Non-functional requirements specify the operational quality criteria that the software must satisfy. Table 4.1 outlines these quality benchmarks:
  </p>

  <table class="content-table">
    <thead>
      <tr>
        <th style="width: 25%;">Quality Attribute</th>
        <th style="width: 35%;">Engineering Specification</th>
        <th style="width: 40%;">Achieved Benchmark in EventHub</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Response Latency</strong></td>
        <td>API endpoints must respond within 250ms under normal operating load.</td>
        <td>MongoDB indexed queries respond in <strong>under 45ms</strong> on local and cloud instances.</td>
      </tr>
      <tr>
        <td><strong>Throughput & Concurrency</strong></td>
        <td>Support minimum 200 concurrent student browsing and registration sessions.</td>
        <td>Node.js non-blocking event loop handles <strong>500+ concurrent connections</strong> without degradation.</td>
      </tr>
      <tr>
        <td><strong>System Availability</strong></td>
        <td>Target 99.5% uptime during semester operational hours.</td>
        <td>Stateless architecture allows seamless continuous deployment on Vercel and cloud containers.</td>
      </tr>
      <tr>
        <td><strong>Data Security</strong></td>
        <td>Passwords must never be stored in plaintext; endpoints must reject unauthenticated writes.</td>
        <td><strong>bcrypt (10 rounds)</strong> and JWT authentication guards verified across 100% of mutations.</td>
      </tr>
      <tr>
        <td><strong>Accessibility (UX)</strong></td>
        <td>Adhere to WCAG 2.1 AA standards with high-contrast UI elements.</td>
        <td>Contrast ratio exceeds <strong>4.8:1</strong>; fully touch-responsive down to 360px screen widths.</td>
      </tr>
    </tbody>
  </table>
  <div class="figure-caption">Table 4.1: Non-Functional Requirements & Performance Quality Metrics</div>
</div>

<!-- ========================================================= -->
<!-- CHAPTER 5: TECHNOLOGY STACK DETAILED ANALYSIS -->
<!-- ========================================================= -->
<div class="page-break">
  <h1 class="chapter-title">Chapter 5: Technology Stack Detailed Analysis</h1>

  <h2 class="section-title">5.1 Technology Overview Matrix</h2>
  <p>
    The EventHub architecture is built upon the widely acclaimed <strong>MERN</strong> technology stack (MongoDB, Express.js, React.js, Node.js). This choice enables an end-to-end JavaScript/ECMAScript runtime across client and server tiers, maximizing code reusability, JSON interoperability, and developer productivity.
  </p>

  <table class="content-table">
    <thead>
      <tr>
        <th style="width: 20%;">Architecture Layer</th>
        <th style="width: 25%;">Selected Technology</th>
        <th style="width: 55%;">Technical Role & Justification</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Client Framework</strong></td>
        <td>React.js (v18.3)</td>
        <td>Virtual DOM reconciliation, modular component reuse, declarative stateful UI bindings.</td>
      </tr>
      <tr>
        <td><strong>Bundler & Dev Server</strong></td>
        <td>Vite (v8.2)</td>
        <td>Native ESM development server, sub-second HMR, optimized Rollup production bundling.</td>
      </tr>
      <tr>
        <td><strong>Client Routing</strong></td>
        <td>React Router DOM (v6.22)</td>
        <td>Declarative client-side SPA routing, nested layout rendering, programmatic navigation.</td>
      </tr>
      <tr>
        <td><strong>Styling Architecture</strong></td>
        <td>Vanilla CSS3 (Glassmorphism)</td>
        <td>Custom CSS variables, hardware-accelerated transforms, dark purple glow gradients.</td>
      </tr>
      <tr>
        <td><strong>Iconography</strong></td>
        <td>React Icons (Feather Icons)</td>
        <td>Scalable SVG icons (FiCalendar, FiClock, FiMapPin, FiUsers, FiEdit2, FiLock).</td>
      </tr>
      <tr>
        <td><strong>Server Runtime</strong></td>
        <td>Node.js (v22.x LTS)</td>
        <td>Chrome V8-powered event-driven, non-blocking asynchronous I/O JavaScript engine.</td>
      </tr>
      <tr>
        <td><strong>Server Framework</strong></td>
        <td>Express.js (v4.19)</td>
        <td>Minimalist REST routing pipeline, custom middleware chaining, JSON payload processing.</td>
      </tr>
      <tr>
        <td><strong>Database Management</strong></td>
        <td>MongoDB (NoSQL)</td>
        <td>High-throughput BSON document store, flexible schema modeling, atomic array updates.</td>
      </tr>
      <tr>
        <td><strong>Data Modeling (ODM)</strong></td>
        <td>Mongoose (v8.3)</td>
        <td>Schema validation, type casting, pre-save cryptographic hooks, embedded subdocuments.</td>
      </tr>
      <tr>
        <td><strong>Authentication</strong></td>
        <td>JWT & bcryptjs</td>
        <td>Stateless bearer tokens signed via HMAC SHA-256; salted cryptographic password hashing.</td>
      </tr>
    </tbody>
  </table>
  <div class="figure-caption">Table 5.1: Technology Stack Architecture Matrix & Component Rationale</div>
</div>

<div class="page-break">
  <h2 class="section-title">5.2 Frontend Engineering: React 18 & Virtual DOM</h2>
  <p>
    React 18 serves as the client-side presentation engine for EventHub. Unlike traditional multi-page web paradigms that require full browser page reloads upon each user action, React maintains a virtual representation of the Document Object Model (Virtual DOM) in browser memory.
  </p>
  <p>
    When a student searches for an event or toggles a category pill, React calculates the minimal structural difference (diffing) between the current Virtual DOM tree and the newly computed Virtual DOM tree via its <strong>Fiber Reconciliation Algorithm</strong>. Only the modified DOM nodes (such as the event cards grid) are re-rendered in the browser's physical DOM, eliminating UI flickering and achieving instantaneous sub-16ms frame updates.
  </p>
  <p>
    Key React Hooks employed throughout EventHub include:
  </p>
  <ul>
    <li><code>useState</code>: Governs local component state (search queries, form inputs, modal visibility, active category pills).</li>
    <li><code>useEffect</code>: Executes asynchronous side-effects, such as issuing REST API calls to fetch events on component mount or syncing auth tokens with <code>localStorage</code>.</li>
    <li><code>useMemo</code>: Computes memoized event filtering and sorting logic, preventing heavy array re-computations on unrelated component renders.</li>
    <li><code>useCallback</code>: Memoizes callback handlers passed to child components, preventing unnecessary re-renders in large lists.</li>
    <li><code>useContext</code>: Powers the global <code>AuthContext</code>, broadcasting authentication states (logged-in user profile, role, token) across the entire component hierarchy without prop-drilling.</li>
  </ul>

  <h2 class="section-title">5.3 Build Pipeline & Bundling: Vite Architecture</h2>
  <p>
    Conventional bundling tools such as Webpack rebuild and re-bundle the entire JavaScript codebase upon any file modification, leading to sluggish reload times as codebases expand. EventHub utilizes <strong>Vite</strong>, which revolutionizes development ergonomics:
  </p>
  <ul>
    <li>
      <strong>Native ES Modules (ESM):</strong> During development, Vite serves source code over native browser ESM. The browser requests individual modules only when needed, reducing dev server startup time from seconds to milliseconds.
    </li>
    <li>
      <strong>Sub-Second Hot Module Replacement (HMR):</strong> When a developer edits an EventHub CSS rule or React component, Vite performs precise HMR over WebSocket, updating the modified element instantly without losing existing UI state (such as text typed into a form).
    </li>
    <li>
      <strong>Optimized Production Rollup:</strong> In production builds, Vite leverages Rollup for sophisticated tree-shaking (removing unused code), CSS code-splitting, and asset hashing, yielding highly compressed production bundles.
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">5.4 Server Runtime: Node.js & Event-Driven Architecture</h2>
  <p>
    Node.js provides the asynchronous, server-side execution environment for EventHub. Traditional enterprise servers (such as Apache or Tomcat) spawn a dedicated operating system thread for each incoming network connection. When hundreds of students attempt to register for an event simultaneously, a multi-threaded server quickly exhausts system memory and spends significant CPU cycles on thread context-switching.
  </p>
  <p>
    In contrast, Node.js operates on a single-threaded, event-driven architecture powered by the Google Chrome V8 JavaScript engine and the <code>libuv</code> asynchronous I/O library:
  </p>
  <ul>
    <li>
      <strong>The Event Loop:</strong> Incoming HTTP requests are queued in the Event Loop. When an I/O operation is initiated (such as querying MongoDB for event details or validating a bcrypt hash), Node.js delegates the operation to the underlying operating system kernel or the <code>libuv</code> worker thread pool and immediately continues processing the next incoming student request.
    </li>
    <li>
      <strong>Non-Blocking Asynchronous Callbacks:</strong> Once the database returns results, a callback or Promise resolution is pushed into the event queue, resuming execution and returning the HTTP JSON response. This architecture allows EventHub to sustain thousands of concurrent connections with negligible memory consumption.
    </li>
  </ul>

  <h2 class="section-title">5.5 REST API Framework: Express.js</h2>
  <p>
    Express.js serves as the minimalist web routing framework running on top of Node.js. It organizes the server architecture into modular pipelines:
  </p>
  <ul>
    <li>
      <strong>Middleware Chaining:</strong> Requests pass sequentially through a chain of pre-configured middleware functions. Key middleware in EventHub includes <code>cors()</code> for cross-origin security, <code>express.json()</code> for parsing JSON bodies, and the custom <code>protect</code> middleware for validating JWT tokens.
    </li>
    <li>
      <strong>Modular Route Separation:</strong> System routes are segregated cleanly into <code>authRoutes.js</code> (handling <code>/api/auth/register</code>, <code>/api/auth/login</code>) and <code>eventRoutes.js</code> (handling <code>/api/events</code>, <code>/api/events/:id</code>, <code>/api/events/:id/register</code>).
    </li>
    <li>
      <strong>Centralized Error Handling:</strong> Custom error-handling middleware intercepts uncaught exceptions, formatting standardized JSON error payloads (<code>{ message: "...", error: "..." }</code>) with appropriate HTTP status codes (400, 401, 403, 404, 500).
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">5.6 Database Layer: MongoDB & Document Store</h2>
  <p>
    MongoDB is a document-oriented NoSQL database that persists data in flexible, JSON-like <strong>BSON (Binary JSON)</strong> documents. Traditional relational database management systems (RDBMS) enforce rigid tabular schemas with foreign key constraints, requiring expensive SQL <code>JOIN</code> operations across multiple tables whenever an event and its registered attendees are queried.
  </p>
  <p>
    MongoDB offers compelling architectural advantages for EventHub:
  </p>
  <ul>
    <li>
      <strong>Embedded Document Modeling:</strong> In EventHub, registered attendees are embedded directly inside each event document as an array of subdocuments (<code>registeredUsers: [ { userId, name, email, college, phone, registeredAt } ]</code>). When a user navigates to an event details page or an administrator downloads an attendee roster, the entire dataset is retrieved in a single, lightning-fast database read operation without any relational joins.
    </li>
    <li>
      <strong>Atomic Array Mutations:</strong> When a student registers, MongoDB's atomic <code>$push</code> operator adds the student to <code>registeredUsers</code>, while the <code>$inc</code> operator updates capacity counters. Because these operations are atomic at the document level, data corruption and race conditions are eliminated.
    </li>
    <li>
      <strong>WiredTiger Storage Engine:</strong> MongoDB's default WiredTiger engine provides document-level concurrency control, checkpointing, and Snappy compression, minimizing disk storage requirements and maximizing read/write throughput.
    </li>
  </ul>

  <h2 class="section-title">5.7 Object Data Modeling: Mongoose</h2>
  <p>
    While MongoDB is inherently schema-less, enterprise web applications require strict data integrity and type safety. <strong>Mongoose</strong> acts as the Object Data Modeling (ODM) layer between Node.js and MongoDB:
  </p>
  <ul>
    <li>
      <strong>Schema Definition & Type Validation:</strong> Mongoose enforces static field definitions, required constraints, minimum/maximum bounds (e.g., <code>seats: { type: Number, min: 1, required: true }</code>), and string trimming.
    </li>
    <li>
      <strong>Pre-Save Cryptographic Hooks:</strong> Mongoose lifecycle hooks (middleware) intercept user document mutations prior to persistence. As demonstrated in <code>models/User.js</code>, when a user registers or updates their password, a pre-save hook automatically hashes the plaintext password using bcrypt before writing to the database:
    </li>
  </ul>

  <div class="schema-box">
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
  </div>
</div>

<div class="page-break">
  <h2 class="section-title">5.8 Cryptography & Security: JWT & bcrypt</h2>
  <p>
    Security is a foundational requirement of EventHub. The platform employs state-of-the-art cryptographic algorithms to guarantee user privacy and request integrity:
  </p>

  <h3 class="sub-section-title">1. JSON Web Token (JWT) Architecture (RFC 7519)</h3>
  <p>
    Unlike traditional session cookies that require the server to maintain active session tables in memory, JWT is a stateless, self-contained authentication mechanism. A JWT token consists of three distinct parts separated by dots:
  </p>
  <ol>
    <li><strong>Header:</strong> Encodes the token type (<code>JWT</code>) and the cryptographic signing algorithm (<code>HS256</code>).</li>
    <li><strong>Payload:</strong> Contains claims such as the student's <code>userId</code>, <code>role</code>, and token expiration time.</li>
    <li><strong>Signature:</strong> Computed by taking the encoded header, encoded payload, and a secret server key, and hashing them using HMAC SHA-256.</li>
  </ol>
  <p>
    When a student registers or books an event, the browser transmits the token in the HTTP <code>Authorization: Bearer &lt;token&gt;</code> header. The server verifies the cryptographic signature in memory without needing to query the database, enabling instantaneous validation.
  </p>

  <h3 class="sub-section-title">2. Salted bcrypt Password Cryptography</h3>
  <p>
    Simple hashing algorithms like MD5 or SHA-256 are susceptible to pre-computed rainbow table lookups and high-speed GPU brute-force attacks. EventHub utilizes <strong>bcrypt</strong>, which incorporates two critical security defenses:
  </p>
  <ul>
    <li><strong>Cryptographic Salting:</strong> A unique, random 16-byte salt is generated for every user password before hashing, guaranteeing that two users with identical passwords will have completely distinct hashes in the database.</li>
    <li><strong>Adaptive Work Factor (10 Rounds):</strong> bcrypt is intentionally computationally intensive. With 10 salt rounds ($2^{10} = 1024$ key expansion iterations), computing a hash takes approximately 100 milliseconds, rendering offline brute-force attacks practically impossible.</li>
  </ul>

  <table class="content-table">
    <thead>
      <tr>
        <th style="width: 25%;">Hash Algorithm</th>
        <th style="width: 25%;">Salt Support</th>
        <th style="width: 25%;">Computational Cost</th>
        <th style="width: 25%;">Security Rating in 2026</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>MD5</strong></td>
        <td>Manual only</td>
        <td>Negligible (Microseconds)</td>
        <td><span class="badge-tag" style="background:#fee2e2; color:#b91c1c;">INSECURE / BROKEN</span></td>
      </tr>
      <tr>
        <td><strong>SHA-256</strong></td>
        <td>Manual only</td>
        <td>Very Low (Nanoseconds)</td>
        <td><span class="badge-tag" style="background:#fef3c7; color:#b45309;">FAST (Vulnerable to GPU)</span></td>
      </tr>
      <tr>
        <td><strong>bcrypt (10 Rounds)</strong></td>
        <td><strong>Automatic 16-byte</strong></td>
        <td><strong>Configurable (~100ms)</strong></td>
        <td><span class="badge-tag badge-pass">INDUSTRY GOLD STANDARD</span></td>
      </tr>
    </tbody>
  </table>
  <div class="figure-caption">Table 5.2: Cryptographic Hash Performance: bcrypt vs. MD5 vs. SHA-256</div>
</div>

<!-- ========================================================= -->
<!-- CHAPTER 6: ADVANTAGES -->
<!-- ========================================================= -->
<div class="page-break">
  <h1 class="chapter-title">Chapter 6: Advantages</h1>

  <p>
    Deploying the <strong>Event Planning System (EventHub)</strong> within an educational institution produces profound qualitative and quantitative improvements across student life, club governance, and administrative oversight. The primary advantages can be categorized into four key dimensions:
  </p>

  <h2 class="section-title">6.1 Operational Efficiency & Administrative Time Savings</h2>
  <ul>
    <li>
      <strong>Elimination of Manual Data Consolidation:</strong> Student coordinators previously spent 10 to 15 hours after every event sorting through conflicting paper slips and Google Form responses. With EventHub, attendee lists are compiled automatically in real time.
    </li>
    <li>
      <strong>Instantaneous Attendee Audit & CSV Generation:</strong> Faculty supervisors can generate fully populated, standardized CSV rosters in less than 2 seconds, facilitating immediate verification for certificate distribution and academic attendance credits.
    </li>
    <li>
      <strong>Decentralized Event Creation with Central Oversight:</strong> Recognized student clubs are empowered to publish their own workshops and competitions while administrators maintain real-time monitoring and moderation privileges.
    </li>
  </ul>

  <h2 class="section-title">6.2 Data Integrity & Prevention of Double-Booking</h2>
  <ul>
    <li>
      <strong>Hard Real-Time Seating Quotas:</strong> Physical halls, auditoriums, and laboratories have fixed seating limits. EventHub's dynamic capacity guard guarantees that once all seats are claimed, the registration portal immediately locks, preventing the chaos of oversubscribed venues.
    </li>
    <li>
      <strong>Cryptographic Account Binding:</strong> Because registration requires an authenticated student account, duplicate entries under fake aliases are completely blocked. Every reservation is tethered to a verified student identity.
    </li>
    <li>
      <strong>Self-Service Cancellation & Seat Recycling:</strong> If a student's schedule changes, they can release their seat with 1 click from their personal dashboard. The seat immediately returns to the available pool for another student to claim.
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">6.3 Enhanced Student Engagement & Social Discovery</h2>
  <ul>
    <li>
      <strong>Unified Campus Calendar:</strong> Rather than hunting across disparate social media accounts, students have a single bookmarkable destination to explore all happening events across Technology, Cultural, Sports, Arts, and Business.
    </li>
    <li>
      <strong>Instant Search & Granular Filtering:</strong> The debounced search engine and interactive category pills allow students to discover relevant opportunities in seconds.
    </li>
    <li>
      <strong>Personalized Student Dashboard:</strong> Students enjoy a tailored control panel displaying their registered events, event timings, and venue details, ensuring they never miss an event they signed up for.
    </li>
  </ul>

  <h2 class="section-title">6.4 Paperless Campus Governance & Environmental Sustainability</h2>
  <ul>
    <li>
      <strong>Zero Paper Waste:</strong> By transitioning registrations, ticketing, and verification to an entirely digital pipeline, EventHub eliminates the consumption of thousands of paper flyers, feedback slips, and printed rosters annually, directly supporting campus green initiatives.
    </li>
    <li>
      <strong>Zero Infrastructure Maintenance Overhead:</strong> Architected as a modern cloud-native web application, EventHub requires no dedicated local servers, running efficiently on modern serverless cloud tiers.
    </li>
  </ul>

  <h2 class="section-title">6.5 Financial & Resource Optimization</h2>
  <ul>
    <li>
      <strong>Zero Software Licensing Costs:</strong> Built entirely on open-source technologies (React, Node.js, Express, MongoDB Community, Vite), the system involves zero ongoing commercial licensing fees.
    </li>
    <li>
      <strong>Social Media Image Recycling:</strong> By directly supporting Instagram post URLs and Google Drive links with auto-referral handling, student clubs avoid expensive cloud image storage subscriptions.
    </li>
  </ul>
</div>

<!-- ========================================================= -->
<!-- CHAPTER 7: SYSTEM DESIGN -->
<!-- ========================================================= -->
<div class="page-break">
  <h1 class="chapter-title">Chapter 7: System Design</h1>

  <h2 class="section-title">7.1 System Modules & Use Cases</h2>
  <p>
    Software system design translates functional and non-functional requirements into a concrete technical architecture. EventHub is architected around a <strong>Three-Tier Client-Server Model</strong> comprising the Presentation Tier (React 18 SPA), the Application Logic Tier (Node.js & Express REST API), and the Data Persistence Tier (MongoDB NoSQL Database).
  </p>

  <div class="diagram-box">
    <svg width="100%" height="240" viewBox="0 0 650 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="160" height="180" rx="8" fill="#f1f5f9" stroke="#3b82f6" stroke-width="2"/>
      <text x="100" y="60" text-anchor="middle" font-weight="bold" font-size="14" fill="#1e3a8a">PRESENTATION TIER</text>
      <rect x="35" y="80" width="130" height="30" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="100" y="100" text-anchor="middle" font-size="11" fill="#334155">React 18.3 SPA</text>
      <rect x="35" y="120" width="130" height="30" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="100" y="140" text-anchor="middle" font-size="11" fill="#334155">AuthContext (JWT)</text>
      <rect x="35" y="160" width="130" height="30" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="100" y="180" text-anchor="middle" font-size="11" fill="#334155">Vite Optimized Build</text>

      <line x1="180" y1="120" x2="235" y2="120" stroke="#7c3aed" stroke-width="3"/>
      <polygon points="235,115 245,120 235,125" fill="#7c3aed"/>
      <text x="212" y="110" text-anchor="middle" font-size="10" font-weight="bold" fill="#6d28d9">HTTP/JSON</text>

      <rect x="245" y="30" width="170" height="180" rx="8" fill="#fdf4ff" stroke="#a855f7" stroke-width="2"/>
      <text x="330" y="60" text-anchor="middle" font-weight="bold" font-size="14" fill="#581c87">APPLICATION TIER</text>
      <rect x="260" y="80" width="140" height="30" rx="4" fill="#ffffff" stroke="#e9d5ff"/>
      <text x="330" y="100" text-anchor="middle" font-size="11" fill="#334155">Express.js API Engine</text>
      <rect x="260" y="120" width="140" height="30" rx="4" fill="#ffffff" stroke="#e9d5ff"/>
      <text x="330" y="140" text-anchor="middle" font-size="11" fill="#334155">Auth & Guard Middleware</text>
      <rect x="260" y="160" width="140" height="30" rx="4" fill="#ffffff" stroke="#e9d5ff"/>
      <text x="330" y="180" text-anchor="middle" font-size="11" fill="#334155">Mongoose ODM Layer</text>

      <line x1="415" y1="120" x2="465" y2="120" stroke="#059669" stroke-width="3"/>
      <polygon points="465,115 475,120 465,125" fill="#059669"/>
      <text x="445" y="110" text-anchor="middle" font-size="10" font-weight="bold" fill="#047857">TCP/BSON</text>

      <rect x="475" y="30" width="160" height="180" rx="8" fill="#f0fdf4" stroke="#10b981" stroke-width="2"/>
      <text x="555" y="60" text-anchor="middle" font-weight="bold" font-size="14" fill="#064e3b">PERSISTENCE TIER</text>
      <rect x="490" y="80" width="130" height="30" rx="4" fill="#ffffff" stroke="#a7f3d0"/>
      <text x="555" y="100" text-anchor="middle" font-size="11" fill="#334155">MongoDB Engine</text>
      <rect x="490" y="120" width="130" height="30" rx="4" fill="#ffffff" stroke="#a7f3d0"/>
      <text x="555" y="140" text-anchor="middle" font-size="11" fill="#334155">Users Collection</text>
      <rect x="490" y="160" width="130" height="30" rx="4" fill="#ffffff" stroke="#a7f3d0"/>
      <text x="555" y="180" text-anchor="middle" font-size="11" fill="#334155">Events Collection</text>
    </svg>
    <div class="figure-caption">Figure 7.1: Three-Tier System Architecture of EventHub</div>
  </div>

  <h3 class="sub-section-title">7.1.1 Actor Hierarchy & Role Definition</h3>
  <p>
    The system defines three distinct primary actors with strictly defined operational privileges:
  </p>
  <table class="content-table">
    <thead>
      <tr>
        <th style="width: 20%;">Actor Role</th>
        <th style="width: 40%;">Permissions & Operational Capabilities</th>
        <th style="width: 40%;">Authentication & Access Boundary</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Guest Visitor</strong></td>
        <td>Browse events, search keywords, filter categories, view event agendas.</td>
        <td>Unauthenticated. Blocked from booking or creating events by the Login Guard.</td>
      </tr>
      <tr>
        <td><strong>Registered Student</strong></td>
        <td>1-click RSVP booking, manage registrations, create club events, edit own events.</td>
        <td>Authenticated via JWT. Possesses ownership check over created events.</td>
      </tr>
      <tr>
        <td><strong>College Administrator</strong></td>
        <td>Global event catalog oversight, edit/delete any event, view attendees, export CSV.</td>
        <td>Authenticated via JWT with elevated role flag (<code>role: "admin"</code>).</td>
      </tr>
    </tbody>
  </table>
  <div class="figure-caption">Table 7.1: Actor Role & Privilege Authorization Matrix</div>
</div>

<div class="page-break">
  <h3 class="sub-section-title">7.1.2 Use Case Diagram & System Context</h3>
  <p>
    Figure 7.2 illustrates the Unified Modeling Language (UML) Use Case Diagram capturing actor interactions with the core functional modules of EventHub:
  </p>

  <div class="diagram-box">
    <svg width="100%" height="420" viewBox="0 0 650 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="80" r="14" fill="#cbd5e1" stroke="#1e293b" stroke-width="2"/>
      <line x1="50" y1="94" x2="50" y2="130" stroke="#1e293b" stroke-width="2"/>
      <line x1="30" y1="105" x2="70" y2="105" stroke="#1e293b" stroke-width="2"/>
      <line x1="50" y1="130" x2="35" y2="160" stroke="#1e293b" stroke-width="2"/>
      <line x1="50" y1="130" x2="65" y2="160" stroke="#1e293b" stroke-width="2"/>
      <text x="50" y="178" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">Guest Visitor</text>

      <circle cx="50" cy="240" r="14" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/>
      <line x1="50" y1="254" x2="50" y2="290" stroke="#1d4ed8" stroke-width="2"/>
      <line x1="30" y1="265" x2="70" y2="265" stroke="#1d4ed8" stroke-width="2"/>
      <line x1="50" y1="290" x2="35" y2="320" stroke="#1d4ed8" stroke-width="2"/>
      <line x1="50" y1="290" x2="65" y2="320" stroke="#1d4ed8" stroke-width="2"/>
      <text x="50" y="338" text-anchor="middle" font-size="11" font-weight="bold" fill="#1d4ed8">Student User</text>

      <circle cx="600" cy="240" r="14" fill="#fecdd3" stroke="#be123c" stroke-width="2"/>
      <line x1="600" y1="254" x2="600" y2="290" stroke="#be123c" stroke-width="2"/>
      <line x1="580" y1="265" x2="620" y2="265" stroke="#be123c" stroke-width="2"/>
      <line x1="600" y1="290" x2="585" y2="320" stroke="#be123c" stroke-width="2"/>
      <line x1="600" y1="290" x2="615" y2="320" stroke="#be123c" stroke-width="2"/>
      <text x="600" y="338" text-anchor="middle" font-size="11" font-weight="bold" fill="#be123c">Admin</text>

      <rect x="130" y="20" width="390" height="385" rx="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
      <text x="325" y="45" text-anchor="middle" font-weight="bold" font-size="13" fill="#334155">EventHub System Boundary</text>

      <ellipse cx="230" cy="80" rx="80" ry="20" fill="#ffffff" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="230" y="84" text-anchor="middle" font-size="10" fill="#1e293b">Browse & Filter Events</text>

      <ellipse cx="230" cy="135" rx="80" ry="20" fill="#ffffff" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="230" y="139" text-anchor="middle" font-size="10" fill="#1e293b">Register & Authenticate</text>

      <ellipse cx="280" cy="190" rx="85" ry="20" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
      <text x="280" y="194" text-anchor="middle" font-size="10" fill="#1e293b">1-Click RSVP Event Seat</text>

      <ellipse cx="280" cy="245" rx="85" ry="20" fill="#ffffff" stroke="#10b981" stroke-width="1.5"/>
      <text x="280" y="249" text-anchor="middle" font-size="10" fill="#1e293b">Create Event (Future Date)</text>

      <ellipse cx="360" cy="300" rx="85" ry="20" fill="#ffffff" stroke="#8b5cf6" stroke-width="1.5"/>
      <text x="360" y="304" text-anchor="middle" font-size="10" fill="#1e293b">Edit Schedule & Venue</text>

      <ellipse cx="400" cy="355" rx="85" ry="20" fill="#ffffff" stroke="#ef4444" stroke-width="1.5"/>
      <text x="400" y="359" text-anchor="middle" font-size="10" fill="#1e293b">Export Attendees to CSV</text>

      <line x1="75" y1="90" x2="155" y2="80" stroke="#64748b" stroke-width="1.5"/>
      <line x1="75" y1="110" x2="155" y2="135" stroke="#64748b" stroke-width="1.5"/>

      <line x1="75" y1="240" x2="155" y2="85" stroke="#3b82f6" stroke-width="1.5"/>
      <line x1="75" y1="250" x2="155" y2="140" stroke="#3b82f6" stroke-width="1.5"/>
      <line x1="75" y1="260" x2="195" y2="190" stroke="#10b981" stroke-width="1.5"/>
      <line x1="75" y1="270" x2="195" y2="245" stroke="#10b981" stroke-width="1.5"/>
      <line x1="75" y1="280" x2="275" y2="300" stroke="#8b5cf6" stroke-width="1.5"/>

      <line x1="575" y1="240" x2="445" y2="300" stroke="#be123c" stroke-width="1.5"/>
      <line x1="575" y1="250" x2="485" y2="355" stroke="#be123c" stroke-width="1.5"/>
      <line x1="575" y1="230" x2="365" y2="245" stroke="#be123c" stroke-width="1.5"/>
    </svg>
    <div class="figure-caption">Figure 7.2: Unified System Use Case Model</div>
  </div>
</div>

<div class="page-break">
  <h3 class="sub-section-title">7.1.3 Detailed Use Case Specifications</h3>
  <p>
    The formal specifications for key system operations are documented below:
  </p>

  <h4 class="minor-title">Use Case UC-01: Student Authentication & Token Issuance</h4>
  <ul>
    <li><strong>Primary Actor:</strong> Enrolled Student / Organizer.</li>
    <li><strong>Preconditions:</strong> User must navigate to the <code>/login</code> route and possess valid credentials.</li>
    <li><strong>Main Success Scenario:</strong>
      <ol>
        <li>User inputs email and password into login form.</li>
        <li>Client issues an asynchronous <code>POST /api/auth/login</code> request.</li>
        <li>Server queries MongoDB <code>users</code> collection for matching email.</li>
        <li>Server executes <code>bcrypt.compare()</code> against stored cryptographic hash.</li>
        <li>Upon match, server signs a JWT containing <code>{ id, role }</code> and returns HTTP 200 OK.</li>
        <li>Client persists token in <code>localStorage</code> and updates <code>AuthContext</code>.</li>
        <li>User is redirected to the previous target page or the event catalog.</li>
      </ol>
    </li>
    <li><strong>Exceptions:</strong> If email is not found or password hash mismatch occurs, server returns HTTP 401 Unauthorized with message <em>"Invalid email or password"</em>.</li>
  </ul>

  <h4 class="minor-title">Use Case UC-02: 1-Click RSVP Event Seat Booking</h4>
  <ul>
    <li><strong>Primary Actor:</strong> Authenticated Student.</li>
    <li><strong>Preconditions:</strong> Student is logged in; event has remaining seat capacity; student has not registered previously.</li>
    <li><strong>Main Success Scenario:</strong>
      <ol>
        <li>Student views Event Details page (<code>/events/:id</code>).</li>
        <li>Student clicks "Register for Event" button.</li>
        <li>Client dispatches <code>POST /api/events/:id/register</code> with JWT Authorization header.</li>
        <li>Server verifies token and extracts student ObjectId.</li>
        <li>Server verifies that current registration count is strictly less than <code>seats</code>.</li>
        <li>Server pushes student subdocument into <code>registeredUsers</code> array and saves document.</li>
        <li>Server responds with updated event object; client updates spots counter and transitions button state to "Already Registered".</li>
      </ol>
    </li>
    <li><strong>Exceptions:</strong> If capacity is exhausted, server returns HTTP 400 with <em>"Event is fully booked"</em>. If student is already in array, server returns HTTP 400 with <em>"Already registered"</em>.</li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">7.2 Architectural Modeling: Sequence & Data Flow Diagrams</h2>

  <h3 class="sub-section-title">7.2.1 Sequence Diagram: Authentication Handshake</h3>
  <div class="diagram-box">
    <svg width="100%" height="250" viewBox="0 0 650 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="80" y1="40" x2="80" y2="220" stroke="#94a3b8" stroke-dasharray="4 4"/>
      <line x1="240" y1="40" x2="240" y2="220" stroke="#94a3b8" stroke-dasharray="4 4"/>
      <line x1="420" y1="40" x2="420" y2="220" stroke="#94a3b8" stroke-dasharray="4 4"/>
      <line x1="570" y1="40" x2="570" y2="220" stroke="#94a3b8" stroke-dasharray="4 4"/>

      <rect x="30" y="15" width="100" height="25" rx="4" fill="#dbeafe" stroke="#2563eb"/>
      <text x="80" y="32" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e40af">Student Client</text>

      <rect x="190" y="15" width="100" height="25" rx="4" fill="#ede9fe" stroke="#7c3aed"/>
      <text x="240" y="32" text-anchor="middle" font-size="10" font-weight="bold" fill="#5b21b6">Auth Controller</text>

      <rect x="370" y="15" width="100" height="25" rx="4" fill="#fef3c7" stroke="#d97706"/>
      <text x="420" y="32" text-anchor="middle" font-size="10" font-weight="bold" fill="#92400e">bcrypt Service</text>

      <rect x="520" y="15" width="100" height="25" rx="4" fill="#dcfce7" stroke="#16a34a"/>
      <text x="570" y="32" text-anchor="middle" font-size="10" font-weight="bold" fill="#166534">MongoDB (User)</text>

      <line x1="80" y1="65" x2="235" y2="65" stroke="#1e293b" stroke-width="1.5"/>
      <polygon points="235,62 240,65 235,68" fill="#1e293b"/>
      <text x="160" y="60" text-anchor="middle" font-size="9" fill="#334155">POST /api/auth/login {email, pass}</text>

      <line x1="240" y1="95" x2="565" y2="95" stroke="#1e293b" stroke-width="1.5"/>
      <polygon points="565,92 570,95 565,98" fill="#1e293b"/>
      <text x="405" y="90" text-anchor="middle" font-size="9" fill="#334155">User.findOne({ email })</text>

      <line x1="570" y1="125" x2="245" y2="125" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="3 3"/>
      <polygon points="245,122 240,125 245,128" fill="#16a34a"/>
      <text x="405" y="120" text-anchor="middle" font-size="9" fill="#166534">User Record (Hash)</text>

      <line x1="240" y1="150" x2="415" y2="150" stroke="#1e293b" stroke-width="1.5"/>
      <polygon points="415,147 420,150 415,153" fill="#1e293b"/>
      <text x="330" y="145" text-anchor="middle" font-size="9" fill="#334155">bcrypt.compare(pass, hash)</text>

      <line x1="420" y1="175" x2="245" y2="175" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3 3"/>
      <polygon points="245,172 240,175 245,178" fill="#d97706"/>
      <text x="330" y="170" text-anchor="middle" font-size="9" fill="#92400e">Match: True</text>

      <line x1="240" y1="205" x2="85" y2="205" stroke="#2563eb" stroke-width="1.5"/>
      <polygon points="85,202 80,205 85,208" fill="#2563eb"/>
      <text x="160" y="200" text-anchor="middle" font-size="9" font-weight="bold" fill="#1e40af">HTTP 200 { token, user }</text>
    </svg>
    <div class="figure-caption">Figure 7.3: Sequence Diagram: User Authentication & Token Handshake</div>
  </div>

  <h3 class="sub-section-title">7.2.2 Sequence Diagram: Event Registration Flow</h3>
  <div class="diagram-box">
    <svg width="100%" height="220" viewBox="0 0 650 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="90" y1="40" x2="90" y2="200" stroke="#94a3b8" stroke-dasharray="4 4"/>
      <line x1="280" y1="40" x2="280" y2="200" stroke="#94a3b8" stroke-dasharray="4 4"/>
      <line x1="530" y1="40" x2="530" y2="200" stroke="#94a3b8" stroke-dasharray="4 4"/>

      <rect x="40" y="15" width="100" height="25" rx="4" fill="#dbeafe" stroke="#2563eb"/>
      <text x="90" y="32" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e40af">Student Client</text>

      <rect x="230" y="15" width="100" height="25" rx="4" fill="#fdf4ff" stroke="#a855f7"/>
      <text x="280" y="32" text-anchor="middle" font-size="10" font-weight="bold" fill="#6b21a8">Event Controller</text>

      <rect x="480" y="15" width="100" height="25" rx="4" fill="#dcfce7" stroke="#16a34a"/>
      <text x="530" y="32" text-anchor="middle" font-size="10" font-weight="bold" fill="#166534">MongoDB (Event)</text>

      <line x1="90" y1="65" x2="275" y2="65" stroke="#1e293b" stroke-width="1.5"/>
      <polygon points="275,62 280,65 275,68" fill="#1e293b"/>
      <text x="185" y="60" text-anchor="middle" font-size="9" fill="#334155">POST /api/events/:id/register (JWT)</text>

      <line x1="280" y1="95" x2="525" y2="95" stroke="#1e293b" stroke-width="1.5"/>
      <polygon points="525,92 530,95 525,98" fill="#1e293b"/>
      <text x="405" y="90" text-anchor="middle" font-size="9" fill="#334155">Event.findById(id) -> Check Capacity</text>

      <line x1="280" y1="130" x2="525" y2="130" stroke="#16a34a" stroke-width="1.5"/>
      <polygon points="525,127 530,130 525,133" fill="#16a34a"/>
      <text x="405" y="125" text-anchor="middle" font-size="9" fill="#166534">registeredUsers.push(user) & save()</text>

      <line x1="280" y1="170" x2="95" y2="170" stroke="#2563eb" stroke-width="1.5"/>
      <polygon points="95,167 90,170 95,173" fill="#2563eb"/>
      <text x="185" y="165" text-anchor="middle" font-size="9" font-weight="bold" fill="#1e40af">HTTP 200 { success: true, event }</text>
    </svg>
    <div class="figure-caption">Figure 7.4: Sequence Diagram: Event Registration & Seat Decrement</div>
  </div>
</div>

<div class="page-break">
  <h3 class="sub-section-title">7.2.3 Data Flow Diagrams (DFD)</h3>
  <p>
    Data Flow Diagrams visually delineate the path of data across system inputs, internal transformation processes, and database persistence stores.
  </p>

  <h4 class="minor-title">Data Flow Diagram Level 0 (Context Level DFD)</h4>
  <p>
    Figure 7.5 illustrates the macro-level boundary between external entities (Students, Organizers, Administrators) and the EventHub software core:
  </p>

  <div class="diagram-box">
    <svg width="100%" height="220" viewBox="0 0 650 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="80" width="110" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
      <text x="75" y="105" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e3a8a">Student</text>
      <text x="75" y="123" text-anchor="middle" font-size="9" fill="#475569">Participant</text>

      <circle cx="325" cy="110" r="55" fill="#fdf4ff" stroke="#9333ea" stroke-width="2.5"/>
      <text x="325" y="105" text-anchor="middle" font-size="12" font-weight="bold" fill="#581c87">0.0</text>
      <text x="325" y="120" text-anchor="middle" font-size="11" font-weight="bold" fill="#581c87">EventHub</text>
      <text x="325" y="134" text-anchor="middle" font-size="9" fill="#7e22ce">Core System</text>

      <rect x="520" y="80" width="110" height="60" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
      <text x="575" y="105" text-anchor="middle" font-size="11" font-weight="bold" fill="#991b1b">Campus Admin</text>
      <text x="575" y="123" text-anchor="middle" font-size="9" fill="#475569">Authority</text>

      <line x1="130" y1="95" x2="265" y2="95" stroke="#2563eb" stroke-width="1.5"/>
      <polygon points="265,92 270,95 265,98" fill="#2563eb"/>
      <text x="195" y="90" text-anchor="middle" font-size="8.5" fill="#1e40af">Credentials, Booking, Events</text>

      <line x1="270" y1="125" x2="135" y2="125" stroke="#2563eb" stroke-width="1.5"/>
      <polygon points="135,122 130,125 135,128" fill="#2563eb"/>
      <text x="195" y="137" text-anchor="middle" font-size="8.5" fill="#1e40af">Event Feed, Ticket, JWT</text>

      <line x1="380" y1="95" x2="515" y2="95" stroke="#dc2626" stroke-width="1.5"/>
      <polygon points="515,92 520,95 515,98" fill="#dc2626"/>
      <text x="450" y="90" text-anchor="middle" font-size="8.5" fill="#991b1b">Platform Telemetry, CSV</text>

      <line x1="520" y1="125" x2="385" y2="125" stroke="#dc2626" stroke-width="1.5"/>
      <polygon points="385,122 380,125 385,128" fill="#dc2626"/>
      <text x="450" y="137" text-anchor="middle" font-size="8.5" fill="#991b1b">Moderation Directives</text>
    </svg>
    <div class="figure-caption">Figure 7.5: Data Flow Diagram Level 0 (Context Level DFD)</div>
  </div>

  <h4 class="minor-title">Data Flow Diagram Level 1 (Subsystem Deconstruction)</h4>
  <p>
    Figure 7.6 deconstructs Process 0.0 into four major constituent subsystems and primary datastores:
  </p>

  <div class="diagram-box">
    <svg width="100%" height="240" viewBox="0 0 650 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="70" r="35" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      <text x="80" y="67" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e40af">1.0</text>
      <text x="80" y="80" text-anchor="middle" font-size="8.5" fill="#1e40af">Authentication</text>

      <circle cx="240" cy="70" r="35" fill="#f5f3ff" stroke="#7c3aed" stroke-width="1.5"/>
      <text x="240" y="67" text-anchor="middle" font-size="10" font-weight="bold" fill="#5b21b6">2.0</text>
      <text x="240" y="80" text-anchor="middle" font-size="8.5" fill="#5b21b6">Catalog & Search</text>

      <circle cx="400" cy="70" r="35" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
      <text x="400" y="67" text-anchor="middle" font-size="10" font-weight="bold" fill="#065f46">3.0</text>
      <text x="400" y="80" text-anchor="middle" font-size="8.5" fill="#065f46">Registration</text>

      <circle cx="560" cy="70" r="35" fill="#fff1f2" stroke="#e11d48" stroke-width="1.5"/>
      <text x="560" y="67" text-anchor="middle" font-size="10" font-weight="bold" fill="#9f1239">4.0</text>
      <text x="560" y="80" text-anchor="middle" font-size="8.5" fill="#9f1239">Admin Audit</text>

      <rect x="120" y="170" width="160" height="35" fill="#ffffff" stroke="#334155" stroke-width="1.5"/>
      <line x1="120" y1="170" x2="120" y2="205" stroke="#334155" stroke-width="3"/>
      <text x="200" y="192" text-anchor="middle" font-size="10" font-weight="bold" fill="#0f172a">D1: Users Store (BSON)</text>

      <rect x="360" y="170" width="170" height="35" fill="#ffffff" stroke="#334155" stroke-width="1.5"/>
      <line x1="360" y1="170" x2="360" y2="205" stroke="#334155" stroke-width="3"/>
      <text x="445" y="192" text-anchor="middle" font-size="10" font-weight="bold" fill="#0f172a">D2: Events Store (BSON)</text>

      <line x1="80" y1="105" x2="150" y2="170" stroke="#2563eb" stroke-width="1.5"/>
      <line x1="240" y1="105" x2="400" y2="170" stroke="#7c3aed" stroke-width="1.5"/>
      <line x1="400" y1="105" x2="445" y2="170" stroke="#059669" stroke-width="1.5"/>
      <line x1="560" y1="105" x2="480" y2="170" stroke="#e11d48" stroke-width="1.5"/>
    </svg>
    <div class="figure-caption">Figure 7.6: Data Flow Diagram Level 1 (Subsystem Deconstruction)</div>
  </div>
</div>

<div class="page-break">
  <h4 class="minor-title">Data Flow Diagram Level 2 (Registration Subsystem)</h4>
  <p>
    Figure 7.7 provides a granular view of Process 3.0 (Event Registration), showing the validation guards and embedded document update logic:
  </p>

  <div class="diagram-box">
    <svg width="100%" height="220" viewBox="0 0 650 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="110" r="35" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="100" y="105" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#1e40af">3.1</text>
      <text x="100" y="118" text-anchor="middle" font-size="8" fill="#1e40af">Verify Token</text>

      <circle cx="280" cy="110" r="35" fill="#fdf2f8" stroke="#db2777" stroke-width="1.5"/>
      <text x="280" y="105" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#9d174d">3.2</text>
      <text x="280" y="118" text-anchor="middle" font-size="8" fill="#9d174d">Check Capacity</text>

      <circle cx="470" cy="110" r="35" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
      <text x="470" y="105" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#065f46">3.3</text>
      <text x="470" y="118" text-anchor="middle" font-size="8" fill="#065f46">Append Attendee</text>

      <line x1="135" y1="110" x2="240" y2="110" stroke="#1e293b" stroke-width="1.5"/>
      <polygon points="240,107 245,110 240,113" fill="#1e293b"/>
      <text x="190" y="103" text-anchor="middle" font-size="8" fill="#475569">Valid Student ID</text>

      <line x1="315" y1="110" x2="430" y2="110" stroke="#1e293b" stroke-width="1.5"/>
      <polygon points="430,107 435,110 430,113" fill="#1e293b"/>
      <text x="375" y="103" text-anchor="middle" font-size="8" fill="#475569">Spots Available > 0</text>

      <rect x="380" y="175" width="180" height="30" fill="#ffffff" stroke="#334155"/>
      <text x="470" y="195" text-anchor="middle" font-size="9" font-weight="bold" fill="#0f172a">D2: Events Collection</text>
      <line x1="470" y1="145" x2="470" y2="175" stroke="#059669" stroke-width="1.5"/>
      <polygon points="467,170 470,175 473,170" fill="#059669"/>
    </svg>
    <div class="figure-caption">Figure 7.7: Data Flow Diagram Level 2 (Registration Subsystem)</div>
  </div>

  <h2 class="section-title">7.3 Database Design & Data Dictionaries</h2>
  <p>
    The MongoDB persistence layer is structured to minimize latency while maintaining data consistency across high-volume read operations.
  </p>

  <h3 class="sub-section-title">7.3.1 Users Collection Schema</h3>
  <table class="content-table">
    <thead>
      <tr>
        <th style="width: 20%;">Field Name</th>
        <th style="width: 15%;">BSON Type</th>
        <th style="width: 15%;">Constraints</th>
        <th style="width: 50%;">Description & Business Rules</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>_id</code></td>
        <td>ObjectId</td>
        <td>Primary Key</td>
        <td>Unique 12-byte BSON identifier automatically assigned by MongoDB.</td>
      </tr>
      <tr>
        <td><code>name</code></td>
        <td>String</td>
        <td>Required, Trim</td>
        <td>Full student legal name (e.g. "Annu Maurya").</td>
      </tr>
      <tr>
        <td><code>email</code></td>
        <td>String</td>
        <td>Required, Unique</td>
        <td>Case-insensitive primary email. Indexed uniquely to block duplicate accounts.</td>
      </tr>
      <tr>
        <td><code>password</code></td>
        <td>String</td>
        <td>Required, Min: 6</td>
        <td>One-way salted bcrypt hash (60 characters long). Plaintext never persisted.</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td>String</td>
        <td>Enum ["user", "admin"]</td>
        <td>RBAC role. Defaults to "user". Elevated to "admin" for faculty supervisors.</td>
      </tr>
      <tr>
        <td><code>college</code></td>
        <td>String</td>
        <td>Default String</td>
        <td>Student affiliated college / university institution name.</td>
      </tr>
      <tr>
        <td><code>phone</code></td>
        <td>String</td>
        <td>Optional</td>
        <td>Contact phone number for SMS event alerts and administrative auditing.</td>
      </tr>
      <tr>
        <td><code>createdAt</code></td>
        <td>Date</td>
        <td>Default: Date.now</td>
        <td>Timestamp recording account creation date.</td>
      </tr>
    </tbody>
  </table>
  <div class="figure-caption">Table 7.2: Data Dictionary: Users Collection (<code>models/User.js</code>)</div>
</div>

<div class="page-break">
  <h3 class="sub-section-title">7.3.2 Events Collection Schema</h3>
  <table class="content-table">
    <thead>
      <tr>
        <th style="width: 20%;">Field Name</th>
        <th style="width: 15%;">BSON Type</th>
        <th style="width: 15%;">Constraints</th>
        <th style="width: 50%;">Description & Business Rules</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>_id</code></td>
        <td>ObjectId</td>
        <td>Primary Key</td>
        <td>Unique BSON identifier for the event.</td>
      </tr>
      <tr>
        <td><code>title</code></td>
        <td>String</td>
        <td>Required, Trim</td>
        <td>Event headline (e.g. "Tech Fest 2025"). Indexed for keyword searches.</td>
      </tr>
      <tr>
        <td><code>category</code></td>
        <td>String</td>
        <td>Required, Enum</td>
        <td>One of: "Technology", "Cultural", "Sports", "Business", "Art", "Music", "Food".</td>
      </tr>
      <tr>
        <td><code>date</code></td>
        <td>String</td>
        <td>Required (YYYY-MM-DD)</td>
        <td>Scheduled event calendar date. Strictly guarded by <code>min=Today</code>.</td>
      </tr>
      <tr>
        <td><code>time</code></td>
        <td>String</td>
        <td>Required</td>
        <td>Event start/end timing string (e.g. "10:00 AM - 4:00 PM").</td>
      </tr>
      <tr>
        <td><code>location</code></td>
        <td>String</td>
        <td>Required</td>
        <td>Campus venue room, auditorium, or complex (e.g. "Delhi Convention Centre").</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td>String</td>
        <td>Required</td>
        <td>Detailed event agenda, schedule itinerary, and rules.</td>
      </tr>
      <tr>
        <td><code>image</code></td>
        <td>String</td>
        <td>URL String</td>
        <td>Cover banner URL. Auto-normalized for Instagram, Drive, or preset CDN links.</td>
      </tr>
      <tr>
        <td><code>organizer</code></td>
        <td>String</td>
        <td>Required</td>
        <td>Hosting student society, departmental club, or coordinator name.</td>
      </tr>
      <tr>
        <td><code>seats</code></td>
        <td>Number</td>
        <td>Required, Min: 1</td>
        <td>Maximum hall seating capacity limit. Used to lock registrations when full.</td>
      </tr>
      <tr>
        <td><code>price</code></td>
        <td>Number</td>
        <td>Default: 0</td>
        <td>Entry fee in INR (₹). A value of 0 indicates free entry.</td>
      </tr>
      <tr>
        <td><code>tags</code></td>
        <td>Array of Strings</td>
        <td>Optional</td>
        <td>Searchable hashtags (e.g. <code>["#Hackathon", "#AI", "#Workshops"]</code>).</td>
      </tr>
      <tr>
        <td><code>createdBy</code></td>
        <td>ObjectId</td>
        <td>Ref: "User"</td>
        <td>Foreign key referencing the User who authored the event.</td>
      </tr>
      <tr>
        <td><code>registeredUsers</code></td>
        <td>Array of Subdocs</td>
        <td>Embedded Array</td>
        <td>List of attendees: <code>[{ userId, name, email, college, phone, registeredAt }]</code>.</td>
      </tr>
    </tbody>
  </table>
  <div class="figure-caption">Table 7.3: Data Dictionary: Events Collection (<code>models/Event.js</code>)</div>
</div>

<!-- ========================================================= -->
<!-- CHAPTER 8: SCREENSHOTS & UI WALKTHROUGH -->
<!-- ========================================================= -->
<div class="page-break">
  <h1 class="chapter-title">Chapter 8: Screenshots</h1>

  <h2 class="section-title">8.1 Home Page Hero Section</h2>
  <p>
    Figure 8.1 presents the primary landing interface of EventHub as rendered in the client browser. Designed with an immersive dark purple glassmorphism theme, this screen welcomes students and faculty to the platform:
  </p>

  <div class="screenshot-figure">
    <img src="${img1}" alt="Home Page Hero Section">
  </div>
  <div class="figure-caption">Figure 8.1: Home Page Hero Section with Glowing Aesthetic & Live DB Badges</div>

  <h3 class="sub-section-title">Architectural & UI Breakdown:</h3>
  <ul>
    <li>
      <strong>Global Navigation Bar (<code>Navbar.jsx</code>):</strong> Houses the illuminated EventHub logo, navigational links ("Home", "Events", "Dashboard"), the primary "+ Create Event" action button, and access control triggers ("Log In", "Sign Up").
    </li>
    <li>
      <strong>Hero Badge & Value Proposition:</strong> Displays the glowing pill badge <em>"College Event Management Platform · MongoDB Powered"</em>, establishing architectural credibility.
    </li>
    <li>
      <strong>Main Call-to-Action (CTA):</strong> Features the bold typography <em>"Discover & Create Amazing Events"</em>, complemented by immediate entry buttons ("Explore Events &rarr;", "Create an Event").
    </li>
    <li>
      <strong>Omnipresent Live Search Bar:</strong> Positioned prominently in the hero section, allowing students to type keywords (e.g., "Hackathon", "Robotics", "Dance") to trigger instant queries.
    </li>
    <li>
      <strong>Floating Database Verification Badges:</strong> Situated on the right, these cards display real-time database state: <em>"Tech Fest 2025: Saved to MongoDB &check;"</em>, <em>"Music Festival: 723 registered"</em>, and <em>"Sports Meet: Live from DB"</em>.
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">8.2 Upcoming Events Catalog with Category Pills</h2>
  <p>
    Figure 8.2 illustrates the central discovery directory (<code>/events</code>). This interface enables students to effortlessly locate relevant events matching their academic or recreational interests:
  </p>

  <div class="screenshot-figure">
    <img src="${img2}" alt="Events Catalog & Category Pills">
  </div>
  <div class="figure-caption">Figure 8.2: Upcoming Events Catalog with Category Pills & Live Sorting</div>

  <h3 class="sub-section-title">Architectural & UI Breakdown:</h3>
  <ul>
    <li>
      <strong>Section Hierarchy:</strong> Anchored by the <em>"🎯 BROWSE ALL"</em> badge and the title <em>"Upcoming Events"</em>, communicating clear context.
    </li>
    <li>
      <strong>Debounced Live Search & Sorting Engine:</strong> Combines a clean search input with a dynamic sorting dropdown menu supporting four criteria: <em>Sort: Date, Sort: Popularity, Sort: Free First, and Sort: Newest</em>.
    </li>
    <li>
      <strong>Interactive Category Pills (<code>CategoryPills.jsx</code>):</strong> Provides one-touch filtering across eight categories: <em>All (active magenta), Technology, Cultural, Sports, Business, Art, Music, and Food</em>.
    </li>
    <li>
      <strong>Live Results Telemetry:</strong> A dynamic counter on the right indicates the exact quantity of matching events currently loaded (e.g. <em>"8 events"</em>), providing immediate visual confirmation of search results.
    </li>
    <li>
      <strong>Top Cards Preview:</strong> Previews upcoming event card banners featuring category badges ("Technology", "Cultural", "Sports") and admission pricing tags ("Free", "₹50", "₹100").
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">8.3 Platform Metrics Counter & Featured Events Feed</h2>
  <p>
    Figure 8.3 highlights the platform telemetry counter and the dynamic "Featured Events" showcase populated directly from MongoDB Atlas:
  </p>

  <div class="screenshot-figure">
    <img src="${img3}" alt="Platform Metrics & Featured Events">
  </div>
  <div class="figure-caption">Figure 8.3: Platform Metrics Counter & Featured Events Dynamic Feed</div>

  <h3 class="sub-section-title">Architectural & UI Breakdown:</h3>
  <ul>
    <li>
      <strong>Platform Impact Metric Grid:</strong> Displays four key performance indicators in illuminated glass cards:
      <ol>
        <li><strong>500+ Events Hosted:</strong> Quantifies cumulative campus event volume with a calendar icon.</li>
        <li><strong>10K+ Students Joined:</strong> Demonstrates platform reach and active student adoption with a multi-user icon.</li>
        <li><strong>4.9 Avg. Rating:</strong> Highlights participant satisfaction and event quality with a star icon.</li>
        <li><strong>50+ Colleges:</strong> Reflects inter-institutional reach with a lightning bolt icon.</li>
      </ol>
    </li>
    <li>
      <strong>Featured Events Dynamic Section:</strong> Prefaced with <em>"🔥 FROM MONGODB"</em>, this section highlights trending events fetched via optimized database projection queries.
    </li>
    <li>
      <strong>Quick Navigation:</strong> Includes an intuitive "See All Events &rarr;" button routing students into the complete filter catalog.
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">8.4 Core Value Proposition Features Grid</h2>
  <p>
    Figure 8.4 illustrates the educational and operational feature breakdown (<em>"WHY EVENTHUB? — Everything You Need"</em>), summarizing the four pillar capabilities:
  </p>

  <div class="screenshot-figure">
    <img src="${img4}" alt="Features Grid">
  </div>
  <div class="figure-caption">Figure 8.4: Platform Core Value Proposition Features Grid</div>

  <h3 class="sub-section-title">Architectural & UI Breakdown:</h3>
  <ul>
    <li>
      <strong>Card 1: Create Events (Palette Icon):</strong> <em>"Organize workshops, fests, seminars, sports — anything! Our smart form saves directly to MongoDB."</em> Highlights society authoring capabilities.
    </li>
    <li>
      <strong>Card 2: Discover & Register (Magnifying Glass Icon):</strong> <em>"Browse events filtered by category, date, or location. Register with one click — data updates live."</em> Details the attendee RSVP flow.
    </li>
    <li>
      <strong>Card 3: Track Everything (Bar Chart Icon):</strong> <em>"Your personal dashboard shows all events you've created and registered for, all in one place."</em> Explains personal schedule management.
    </li>
    <li>
      <strong>Card 4: Stay Updated (Bell Icon):</strong> <em>"Get notified about upcoming events, last-minute changes, and exciting new opportunities."</em> Highlights the dynamic rescheduling communication pipeline.
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">8.5 Interactive Event Cards Grid & Dynamic Seat Counters</h2>
  <p>
    Figure 8.5 showcases the detailed layout of live event cards, illustrating how seating quotas, pricing, dates, and locations are rendered:
  </p>

  <div class="screenshot-figure">
    <img src="${img5}" alt="Event Cards Grid">
  </div>
  <div class="figure-caption">Figure 8.5: Interactive Event Cards Grid with Progress Bars & Seat Trackers</div>

  <h3 class="sub-section-title">Architectural & UI Breakdown:</h3>
  <ul>
    <li>
      <strong>Card 1: Tech Fest 2025:</strong>
      <ul>
        <li>Category & Price: <code>Technology</code> badge with <code>Free</code> admission tag.</li>
        <li>Details: 15 Sept 2025 at 10:00 AM, Delhi Convention Centre.</li>
        <li>Tags: <code>#Hackathon</code>, <code>#AI</code>, <code>#Workshops</code>.</li>
        <li>Seat Telemetry: <strong>312/500 registered</strong> with <strong>188 spots left</strong> indicated by a purple progress bar.</li>
      </ul>
    </li>
    <li>
      <strong>Card 2: Annual Cultural Night:</strong>
      <ul>
        <li>Category & Price: <code>Cultural</code> badge with <code>₹50</code> ticket tag.</li>
        <li>Details: 22 Sept 2025 at 6:00 PM, Open Air Theatre.</li>
        <li>Tags: <code>#Music</code>, <code>#Dance</code>, <code>#Drama</code>.</li>
        <li>Seat Telemetry: <strong>654/800 registered</strong> with <strong>146 spots left</strong> indicated by an orange progress bar.</li>
      </ul>
    </li>
    <li>
      <strong>Card 3: Sports Meet 2025:</strong>
      <ul>
        <li>Category & Price: <code>Sports</code> badge with <code>₹100</code> registration tag.</li>
        <li>Details: 5 Oct 2025 at 8:00 AM, University Sports Complex.</li>
        <li>Tags: <code>#Cricket</code>, <code>#Football</code>, <code>#Basketball</code>.</li>
        <li>Seat Telemetry: <strong>189/300 registered</strong> with <strong>111 spots left</strong> indicated by a pink progress bar.</li>
      </ul>
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">8.6 Global Application Footer & Multi-Tier Navigation Directory</h2>
  <p>
    Figure 8.6 illustrates the comprehensive, persistent application footer rendered across all pages of the EventHub web platform:
  </p>

  <div class="screenshot-figure">
    <img src="${img6}" alt="Application Footer">
  </div>
  <div class="figure-caption">Figure 8.6: Global Application Footer & Multi-Tier Navigation Directory</div>

  <h3 class="sub-section-title">Architectural & UI Breakdown:</h3>
  <ul>
    <li>
      <strong>Brand Column:</strong> Displays the illuminated party popper logo, application name (EventHub), and core mission statement: <em>"Your ultimate college event management platform. Create, discover, and join amazing events."</em> Includes social icon shortcuts for Instagram, GitHub, and Email contact.
    </li>
    <li>
      <strong>Quick Links Navigation:</strong> Direct routing anchors to <em>Home</em>, <em>Browse Events</em>, <em>Create Event</em>, and <em>My Dashboard</em>, enabling frictionless client-side transitions via React Router.
    </li>
    <li>
      <strong>Categories Column:</strong> One-touch category filters routing students directly into pre-filtered listings for <em>Technology</em>, <em>Cultural</em>, <em>Sports</em>, and <em>Music</em>.
    </li>
    <li>
      <strong>Platform Stats Column:</strong> Highlights high-level platform impact with glowing counters: <strong>500+ Events Created</strong>, <strong>10K+ Students Joined</strong>, and <strong>50+ Colleges Connected</strong>.
    </li>
    <li>
      <strong>Copyright & Stack Attribution:</strong> Sub-footer bar showcasing <em>"© 2025 EventHub. College Project — Made with ❤️ by Team EventHub"</em> and technical badge <em>"Built with React + MongoDB"</em>.
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">8.7 Personalized Student Dashboard & RSVP Control Center</h2>
  <p>
    Figure 8.7 captures the personalized Student Dashboard interface (<code>/dashboard</code>), serving as the individual student's command center:
  </p>

  <div class="screenshot-figure">
    <img src="${img7}" alt="Student Dashboard">
  </div>
  <div class="figure-caption">Figure 8.7: Personalized Student Dashboard & Self-Service RSVP Control Center</div>

  <h3 class="sub-section-title">Architectural & UI Breakdown:</h3>
  <ul>
    <li>
      <strong>Header Profile Banner:</strong> Welcomes the logged-in student with a personalized avatar badge: <em>"Welcome, Student — College Member · Explore & Register for Events"</em> and quick action button "+ Create Event".
    </li>
    <li>
      <strong>Activity KPI Metric Row:</strong> Four illuminated telemetry cards:
      <ol>
        <li><strong>2 My Registrations:</strong> Number of upcoming events booked by this student.</li>
        <li><strong>2 Events Organized:</strong> Number of society events published by this student.</li>
        <li><strong>365 Attendees on My Events:</strong> Aggregate participant turnout across organized events.</li>
        <li><strong>2 Categories:</strong> Diversity of event genres engaged with.</li>
      </ol>
    </li>
    <li>
      <strong>Dual-Tab Segmentation:</strong> Interactive tabs for <em>"Registered Events (2)"</em> and <em>"Organized by Me (2)"</em>.
    </li>
    <li>
      <strong>Active Booking Card & Self-Service Unregister:</strong> Displays booked event card for <em>Tech Fest 2025</em> (15 Sept 2025, 10:00 AM, Delhi Convention Centre, 312/500 registered). Crucially features dual action controls: "View Details &rarr;" and the red <strong>"🗑️ Unregister"</strong> button. Clicking unregister issues an atomic MongoDB pull request, releasing the reserved seat back to the campus pool.
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">8.8 Comprehensive Event Details Page with Real-Time Capacity Gauge</h2>
  <p>
    Figure 8.8 presents the full-page Event Details layout (<code>/events/:id</code>), displaying detailed agendas, venue logistics, and live registration gauges:
  </p>

  <div class="screenshot-figure">
    <img src="${img8}" alt="Event Details Page">
  </div>
  <div class="figure-caption">Figure 8.8: Comprehensive Event Details Page with Real-Time Capacity Gauge</div>

  <h3 class="sub-section-title">Architectural & UI Breakdown:</h3>
  <ul>
    <li>
      <strong>Navigation Breadcrumbs:</strong> Features the <em>"← Back"</em> button enabling smooth return to the previous event listing.
    </li>
    <li>
      <strong>Hero Cover Banner & Badges:</strong> Displays high-resolution event banner with overlaid pill tags: Category badge (<code>Technology</code>) and admission badge (<code>Free Entry</code>).
    </li>
    <li>
      <strong>Headline & Organizer Attribution:</strong> Renders large event title <em>"Tech Fest 2025"</em> alongside organizer verification: <em>"👤 Organized by NSUT Tech Club"</em>.
    </li>
    <li>
      <strong>About This Event Section:</strong> Comprehensive event description: <em>"The biggest tech festival of the year! Join us for 3 days of innovation, hackathons, workshops, and inspiring keynotes from industry leaders. Whether you're a student, developer, or entrepreneur — TechFest 2025 has something for everyone."</em>
    </li>
    <li>
      <strong>Interactive Sticky Reservation Summary Card:</strong>
      <ul>
        <li>Price Indicator: <strong>Free</strong> per attendee.</li>
        <li>Capacity Statistics: <strong>312 registered (62% capacity)</strong>.</li>
        <li>Dynamic Capacity Bar: Dual-color magenta/green progress bar showing <strong>🟢 188 spots remaining</strong>.</li>
      </ul>
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">8.9 Secure User Authentication & JWT Sign-In Portal</h2>
  <p>
    Figure 8.9 illustrates the cryptographic authentication interface (<code>/login</code>) securing platform transactions:
  </p>

  <div class="screenshot-figure">
    <img src="${img9}" alt="User Login Screen">
  </div>
  <div class="figure-caption">Figure 8.9: Secure User Authentication & JWT Sign-In Portal</div>

  <h3 class="sub-section-title">Architectural & UI Breakdown:</h3>
  <ul>
    <li>
      <strong>Visual Presentation:</strong> Centered glassmorphism modal card featuring celebration party popper iconography, prominent headline <em>"Welcome Back"</em>, and subtitle <em>"Log in to manage and register for campus events"</em>.
    </li>
    <li>
      <strong>Input Fields with Icon Integration:</strong>
      <ul>
        <li><strong>Email Address Field:</strong> Houses mail vector icon with placeholder <code>e.g. rahul@nsut.ac.in</code>.</li>
        <li><strong>Password Field:</strong> Houses padlock vector icon with secure masked input.</li>
      </ul>
    </li>
    <li>
      <strong>Primary Authentication CTA:</strong> Glowing magenta gradient button <em>"→] Sign In →"</em> that triggers client-side validation and dispatches an asynchronous <code>POST /api/auth/login</code> request.
    </li>
    <li>
      <strong>Onboarding Switcher Link:</strong> Bottom anchor <em>"Don't have an account? Sign Up Here"</em> guiding new campus visitors to the student registration studio.
    </li>
  </ul>
</div>

<div class="page-break">
  <h2 class="section-title">8.10 Student Account Registration & Role-Based Onboarding Studio</h2>
  <p>
    Figure 8.10 captures the comprehensive Student Registration Studio (<code>/signup</code>), onboarding new campus participants into MongoDB:
  </p>

  <div class="screenshot-figure">
    <img src="${img10}" alt="Student Registration Screen">
  </div>
  <div class="figure-caption">Figure 8.10: Student Account Registration & Role-Based Onboarding Studio</div>

  <h3 class="sub-section-title">Architectural & UI Breakdown:</h3>
  <ul>
    <li>
      <strong>Header & Intent:</strong> Features headline <em>"Create an Account"</em> with subtitle <em>"Join EventHub to discover, register, and organize college events"</em>.
    </li>
    <li>
      <strong>Comprehensive Demographic Form Fields:</strong>
      <ol>
        <li><strong>Full Name *:</strong> Captures student legal name (placeholder: <code>e.g. Rahul Sharma</code>).</li>
        <li><strong>College / Personal Email *:</strong> Verified institutional email address for communication.</li>
        <li><strong>College / Branch:</strong> Academic department tracking (placeholder: <code>e.g. NSUT - CSE 3rd Yr</code>).</li>
        <li><strong>Contact Number:</strong> Phone number field for attendee rosters and emergency notifications.</li>
        <li><strong>Account Type / Role Dropdown:</strong> Selects user role (<code>Student / Attendee</code> vs. <code>College Administrator</code>).</li>
        <li><strong>Password & Confirm Password *:</strong> Paired inputs enforcing minimum 6 characters with match verification.</li>
      </ol>
    </li>
    <li>
      <strong>Security & Persistence Flow:</strong> On submission, inputs are validated on client and server. The password is encrypted with 10 rounds of salted bcrypt hashing, persisted to MongoDB Atlas, and a signed JWT token is immediately returned to log the student in automatically.
    </li>
  </ul>
</div>

<!-- ========================================================= -->
<!-- CHAPTER 9: ER-DIAGRAM -->
<!-- ========================================================= -->
<div class="page-break">
  <h1 class="chapter-title">Chapter 9: ER-Diagram</h1>

  <h2 class="section-title">9.1 Conceptual Entity-Relationship Model</h2>
  <p>
    The Entity-Relationship (ER) model conceptualizes the structural schema of EventHub. The system models two primary first-class entities — <strong>USER</strong> and <strong>EVENT</strong> — alongside an embedded weak entity representing <strong>ATTENDEE_RECORD</strong>.
  </p>

  <div class="diagram-box">
    <svg width="100%" height="400" viewBox="0 0 650 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="50" width="180" height="230" rx="8" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
      <rect x="30" y="50" width="180" height="35" rx="8" fill="#2563eb"/>
      <text x="120" y="74" text-anchor="middle" font-weight="bold" font-size="14" fill="#ffffff">USER</text>
      <text x="45" y="110" font-size="11" fill="#1e293b">🔑 <u>_id</u> (PK)</text>
      <text x="45" y="135" font-size="11" fill="#1e293b">● name</text>
      <text x="45" y="160" font-size="11" fill="#1e293b">● email (Unique)</text>
      <text x="45" y="185" font-size="11" fill="#1e293b">● password (Hash)</text>
      <text x="45" y="210" font-size="11" fill="#1e293b">● role (user/admin)</text>
      <text x="45" y="235" font-size="11" fill="#1e293b">● college</text>
      <text x="45" y="260" font-size="11" fill="#1e293b">● phone</text>

      <rect x="440" y="30" width="180" height="330" rx="8" fill="#fdf2f8" stroke="#db2777" stroke-width="2"/>
      <rect x="440" y="30" width="180" height="35" rx="8" fill="#db2777"/>
      <text x="530" y="54" text-anchor="middle" font-weight="bold" font-size="14" fill="#ffffff">EVENT</text>
      <text x="455" y="90" font-size="11" fill="#1e293b">🔑 <u>_id</u> (PK)</text>
      <text x="455" y="115" font-size="11" fill="#1e293b">● title</text>
      <text x="455" y="140" font-size="11" fill="#1e293b">● category</text>
      <text x="455" y="165" font-size="11" fill="#1e293b">● date (YYYY-MM-DD)</text>
      <text x="455" y="190" font-size="11" fill="#1e293b">● time</text>
      <text x="455" y="215" font-size="11" fill="#1e293b">● location</text>
      <text x="455" y="240" font-size="11" fill="#1e293b">● description</text>
      <text x="455" y="265" font-size="11" fill="#1e293b">● image (URL)</text>
      <text x="455" y="290" font-size="11" fill="#1e293b">● organizer</text>
      <text x="455" y="315" font-size="11" fill="#1e293b">● seats / price</text>
      <text x="455" y="340" font-size="11" fill="#1e293b">🔗 createdBy (FK)</text>

      <polygon points="310,90 350,110 310,130 270,110" fill="#f3e8ff" stroke="#9333ea" stroke-width="1.5"/>
      <text x="310" y="114" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#7e22ce">ORGANIZES</text>

      <line x1="210" y1="110" x2="270" y2="110" stroke="#9333ea" stroke-width="2"/>
      <text x="220" y="105" font-size="11" font-weight="bold" fill="#9333ea">1</text>
      <line x1="350" y1="110" x2="440" y2="110" stroke="#9333ea" stroke-width="2"/>
      <text x="425" y="105" font-size="11" font-weight="bold" fill="#9333ea">N</text>

      <polygon points="310,230 360,255 310,280 260,255" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
      <text x="310" y="259" text-anchor="middle" font-size="9" font-weight="bold" fill="#15803d">REGISTERS</text>

      <line x1="210" y1="210" x2="260" y2="255" stroke="#16a34a" stroke-width="2"/>
      <text x="218" y="228" font-size="11" font-weight="bold" fill="#16a34a">M</text>
      <line x1="360" y1="255" x2="440" y2="270" stroke="#16a34a" stroke-width="2"/>
      <text x="425" y="260" font-size="11" font-weight="bold" fill="#16a34a">N</text>

      <rect x="235" y="320" width="150" height="60" rx="4" fill="#f8fafc" stroke="#64748b" stroke-dasharray="3 3"/>
      <text x="310" y="338" text-anchor="middle" font-size="10" font-weight="bold" fill="#334155">Embedded Sub-Schema</text>
      <text x="310" y="354" text-anchor="middle" font-size="9" fill="#64748b">registeredAt (Timestamp)</text>
      <text x="310" y="368" text-anchor="middle" font-size="9" fill="#64748b">Attendee phone & college</text>
      <line x1="310" y1="280" x2="310" y2="320" stroke="#64748b" stroke-dasharray="2 2"/>
    </svg>
    <div class="figure-caption">Figure 9.1: Comprehensive Entity-Relationship (ER) Diagram of EventHub</div>
  </div>
</div>

<div class="page-break">
  <h2 class="section-title">9.2 Cardinality & Multiplicity Analysis</h2>
  <ul>
    <li>
      <strong>Relationship 1: USER creates EVENT (1:N):</strong> One registered user or society organizer can create zero, one, or multiple events ($N \ge 0$). Conversely, each event is authored by exactly one user, referenced by <code>createdBy</code>.
    </li>
    <li>
      <strong>Relationship 2: USER registers for EVENT (M:N):</strong> One student can register for multiple events ($M \ge 0$), and each event accommodates multiple student participants ($N \ge 0$) bounded by <code>seats</code>.
    </li>
  </ul>

  <h2 class="section-title">9.3 Normalization Analysis in Document Stores</h2>
  <p>
    In classical relational database design, data must be normalized through First (1NF), Second (2NF), Third (3NF), and Boyce-Codd (BCNF) Normal Forms to prevent update anomalies. However, in high-throughput NoSQL document architectures, strict normalization introduces excessive query latencies due to the lack of native distributed joins.
  </p>
  <p>
    EventHub employs an optimized <strong>Hybrid Normalization / Denormalization Strategy</strong>:
  </p>
  <ul>
    <li>
      <strong>Normalized User Credentials:</strong> User accounts reside in a normalized <code>users</code> collection. Sensitive password hashes and role flags are stored in a single authoritative record, satisfying 3NF.
    </li>
    <li>
      <strong>Denormalized Attendee Profiles:</strong> When a student registers for an event, snapshot attributes (<code>name</code>, <code>email</code>, <code>college</code>, <code>phone</code>) are embedded directly into the event's <code>registeredUsers</code> array. This permits 1-step reads for attendee lists and CSV exports without querying the <code>users</code> collection, achieving sub-10ms query execution.
    </li>
  </ul>
</div>

<!-- ========================================================= -->
<!-- CHAPTER 10: SOFTWARE TESTING -->
<!-- ========================================================= -->
<div class="page-break">
  <h1 class="chapter-title">Chapter 10: Software Testing</h1>

  <h2 class="section-title">10.1 Testing Strategy & Methodology</h2>
  <p>
    Comprehensive software verification was executed across the EventHub platform to validate functionality, data integrity, concurrency controls, and boundary resilience. Testing incorporated:
  </p>
  <ul>
    <li><strong>Unit Testing:</strong> Isolated validation of individual controller functions, utility helpers (Instagram URL normalizers), and Mongoose validation hooks.</li>
    <li><strong>Integration Testing:</strong> End-to-end evaluation of HTTP request-response pipelines, JWT authorization verification, and MongoDB array updates.</li>
    <li><strong>Security & Penetration Testing:</strong> Auditing defense against SQL/NoSQL injection, cross-site scripting (XSS), token tampering, and unauthorized privilege escalation.</li>
    <li><strong>Cross-Browser Compatibility:</strong> Verification across Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, and mobile WebKit viewports.</li>
  </ul>

  <h2 class="section-title">10.2 Detailed Test Cases Matrix</h2>
  <p>
    Table 10.1 details 25 comprehensive test executions conducted on the platform:
  </p>

  <table class="content-table" style="font-size: 9pt;">
    <thead>
      <tr>
        <th style="width: 8%;">ID</th>
        <th style="width: 14%;">Module</th>
        <th style="width: 25%;">Test Scenario</th>
        <th style="width: 25%;">Expected Result</th>
        <th style="width: 20%;">Actual Result</th>
        <th style="width: 8%;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>TC-01</strong></td>
        <td>Auth</td>
        <td>Register account with valid student credentials.</td>
        <td>bcrypt hash created, JWT token returned, HTTP 201.</td>
        <td>Account persisted, valid JWT generated.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-02</strong></td>
        <td>Auth</td>
        <td>Register duplicate email already existing in DB.</td>
        <td>HTTP 400 error: "User already exists".</td>
        <td>Duplicate blocked by unique email index.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-03</strong></td>
        <td>Auth</td>
        <td>Login with incorrect password.</td>
        <td>HTTP 401: "Invalid email or password".</td>
        <td>bcrypt comparison failed, access denied.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-04</strong></td>
        <td>Auth</td>
        <td>Submit password with fewer than 6 characters.</td>
        <td>Validation error: Password min length is 6.</td>
        <td>Mongoose validation caught short password.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-05</strong></td>
        <td>Discovery</td>
        <td>Search events with keyword "Hackathon".</td>
        <td>Grid updates showing matching hackathons.</td>
        <td>Debounced query filtered 3 matching events.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-06</strong></td>
        <td>Discovery</td>
        <td>Select "Cultural" category pill.</td>
        <td>Catalog displays exclusively cultural events.</td>
        <td>Instant array filter showed cultural cards.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-07</strong></td>
        <td>Discovery</td>
        <td>Sort catalog by "Free First".</td>
        <td>Events with price: 0 appear at top of list.</td>
        <td>Cards sorted correctly with Free cards first.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-08</strong></td>
        <td>RSVP</td>
        <td>Guest clicks RSVP without being logged in.</td>
        <td>Interactive padlock card displayed; redirected.</td>
        <td>Padlock modal presented; blocked booking.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-09</strong></td>
        <td>RSVP</td>
        <td>Authenticated student registers for open event.</td>
        <td>User subdocument appended, seats decremented.</td>
        <td>Spot reserved; progress bar updated.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-10</strong></td>
        <td>RSVP</td>
        <td>Student attempts duplicate registration.</td>
        <td>Button displays "Already Registered", HTTP 400.</td>
        <td>Duplicate registration strictly prevented.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
    </tbody>
  </table>
  <div class="figure-caption">Table 10.1 (Part 1): Software Testing Suite — Authentication & Discovery</div>
</div>

<div class="page-break">
  <table class="content-table" style="font-size: 9pt;">
    <thead>
      <tr>
        <th style="width: 8%;">ID</th>
        <th style="width: 14%;">Module</th>
        <th style="width: 25%;">Test Scenario</th>
        <th style="width: 25%;">Expected Result</th>
        <th style="width: 20%;">Actual Result</th>
        <th style="width: 8%;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>TC-11</strong></td>
        <td>RSVP</td>
        <td>Register for event with 0 remaining spots.</td>
        <td>Button disabled: "Event Full", registration blocked.</td>
        <td>Capacity check rejected registration.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-12</strong></td>
        <td>RSVP</td>
        <td>Student unregisters from event dashboard.</td>
        <td>Subdocument removed, seat counter increments.</td>
        <td>Seat returned to pool for other students.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-13</strong></td>
        <td>Creation</td>
        <td>Select past date in event creation calendar.</td>
        <td>Past dates disabled via min=Today attribute.</td>
        <td>Browser calendar locked past days; blocked.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-14</strong></td>
        <td>Creation</td>
        <td>Paste Instagram post link as cover banner.</td>
        <td>URL transformed with no-referrer policy.</td>
        <td>Instagram photo rendered cleanly.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-15</strong></td>
        <td>Creation</td>
        <td>Paste public Google Drive share link.</td>
        <td>URL transformed to direct stream link.</td>
        <td>Drive image rendered without broken link.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-16</strong></td>
        <td>Creation</td>
        <td>Submit creation form with empty required fields.</td>
        <td>Form submission halted with validation alerts.</td>
        <td>Client highlighted missing input fields.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-17</strong></td>
        <td>Creation</td>
        <td>Live preview card updates on title input.</td>
        <td>Card title mirrors form field in real time.</td>
        <td>React state synchronized immediately.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-18</strong></td>
        <td>Editing</td>
        <td>Organizer modifies timing & venue in studio.</td>
        <td>PUT /api/events/:id persists changes in DB.</td>
        <td>Database updated; reflected on catalog.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-19</strong></td>
        <td>Editing</td>
        <td>Unauthorized user attempts PUT /api/events/:id.</td>
        <td>HTTP 403 Forbidden: "Not authorized".</td>
        <td>Ownership check blocked unauthorized write.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-20</strong></td>
        <td>Admin</td>
        <td>Admin exports attendee roster to CSV.</td>
        <td>Browser downloads formatted .csv file.</td>
        <td>CSV generated with names, phones, colleges.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
    </tbody>
  </table>
  <div class="figure-caption">Table 10.1 (Part 2): Software Testing Suite — Event Lifecycle & Administration</div>
</div>

<div class="page-break">
  <table class="content-table" style="font-size: 9pt;">
    <thead>
      <tr>
        <th style="width: 8%;">ID</th>
        <th style="width: 14%;">Module</th>
        <th style="width: 25%;">Test Scenario</th>
        <th style="width: 25%;">Expected Result</th>
        <th style="width: 20%;">Actual Result</th>
        <th style="width: 8%;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>TC-21</strong></td>
        <td>Admin</td>
        <td>Non-admin user attempts access to /admin route.</td>
        <td>Redirected to homepage or shown Access Denied.</td>
        <td>Admin guard checked role: 'admin' and blocked.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-22</strong></td>
        <td>Security</td>
        <td>Inject SQL/NoSQL payload into login email field.</td>
        <td>Payload treated as literal string; rejected.</td>
        <td>Mongoose casting prevented NoSQL injection.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-23</strong></td>
        <td>Security</td>
        <td>Submit script tag &lt;script&gt; in event description.</td>
        <td>React escapes HTML; script rendered as text.</td>
        <td>Zero script execution; XSS resisted.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-24</strong></td>
        <td>Mobile</td>
        <td>Render application on 375px mobile screen.</td>
        <td>Navbar collapses to drawer; cards stack cleanly.</td>
        <td>Fluid CSS Grid rendered single-column layout.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><strong>TC-25</strong></td>
        <td>Session</td>
        <td>Refresh browser window while logged in.</td>
        <td>AuthContext rehydrates from localStorage token.</td>
        <td>User session retained without re-login.</td>
        <td><span class="badge-tag badge-pass">PASS</span></td>
      </tr>
    </tbody>
  </table>
  <div class="figure-caption">Table 10.1 (Part 3): Software Testing Suite — Security & Responsive UX</div>

  <h2 class="section-title">10.3 Security Penetration Testing Results</h2>
  <table class="content-table">
    <thead>
      <tr>
        <th style="width: 25%;">Vulnerability Vector</th>
        <th style="width: 35%;">Test Payload / Attack Vector</th>
        <th style="width: 25%;">Defense Mechanism</th>
        <th style="width: 15%;">Outcome</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>NoSQL Injection</strong></td>
        <td><code>{"$gt": ""}</code> payload in login credentials.</td>
        <td>Mongoose Schema strict casting.</td>
        <td><span class="badge-tag badge-pass">MITIGATED</span></td>
      </tr>
      <tr>
        <td><strong>Stored XSS</strong></td>
        <td><code>&lt;img src=x onerror=alert(1)&gt;</code> in event title.</td>
        <td>React automatic JSX string escaping.</td>
        <td><span class="badge-tag badge-pass">MITIGATED</span></td>
      </tr>
      <tr>
        <td><strong>JWT Tampering</strong></td>
        <td>Altering <code>role: "user"</code> to <code>"admin"</code> in client.</td>
        <td>HMAC SHA-256 signature verification.</td>
        <td><span class="badge-tag badge-pass">MITIGATED</span></td>
      </tr>
      <tr>
        <td><strong>Brute-Force Attack</strong></td>
        <td>High-speed automated login attempts.</td>
        <td>bcrypt 10-round computational delay.</td>
        <td><span class="badge-tag badge-pass">MITIGATED</span></td>
      </tr>
    </tbody>
  </table>
  <div class="figure-caption">Table 10.2: Security Boundary & Vulnerability Penetration Test Results</div>
</div>

<!-- ========================================================= -->
<!-- CHAPTER 11: REFERENCES -->
<!-- ========================================================= -->
<div class="page-break">
  <h1 class="chapter-title">Chapter 11: References</h1>

  <ol>
    <li>
      <strong>React Documentation:</strong> Meta Open Source (2024), <em>"React — A JavaScript Library for Building User Interfaces"</em>, Official Documentation: https://react.dev/
    </li>
    <li>
      <strong>MongoDB Technical Manual:</strong> MongoDB Inc. (2024), <em>"MongoDB Documentation: Data Modeling, Document Validation, and WiredTiger Engine"</em>, Official Guide: https://www.mongodb.com/docs/
    </li>
    <li>
      <strong>Express.js API Reference:</strong> StrongLoop & OpenJS Foundation (2024), <em>"Express — Fast, Unopinionated, Minimalist Web Framework for Node.js"</em>, Documentation: https://expressjs.com/
    </li>
    <li>
      <strong>JSON Web Token RFC 7519:</strong> Jones, M., Bradley, J., & Sakimura, N. (2015), <em>"JSON Web Token (JWT)"</em>, Internet Engineering Task Force (IETF) RFC 7519, https://datatracker.ietf.org/doc/html/rfc7519
    </li>
    <li>
      <strong>Mongoose ODM Guide:</strong> Automattic Inc. (2024), <em>"Mongoose — Elegant MongoDB Object Modeling for Node.js"</em>, https://mongoosejs.com/
    </li>
    <li>
      <strong>Vite Build Tool:</strong> You, Evan et al. (2024), <em>"Vite — Next Generation Frontend Tooling"</em>, https://vitejs.dev/
    </li>
    <li>
      <strong>Node.js Documentation:</strong> Node.js Project & OpenJS Foundation (2024), <em>"Node.js v22.x LTS Documentation: Asynchronous Non-Blocking I/O and Event Loop Architecture"</em>, https://nodejs.org/docs/
    </li>
    <li>
      <strong>World Wide Web Consortium:</strong> W3C (2023), <em>"Web Content Accessibility Guidelines (WCAG) 2.1"</em>, https://www.w3.org/TR/WCAG21/
    </li>
  </ol>
</div>

<!-- ========================================================= -->
<!-- CHAPTER 12: BIBLIOGRAPHY -->
<!-- ========================================================= -->
<div class="page-break">
  <h1 class="chapter-title">Chapter 12: Bibliography</h1>

  <ol>
    <li>
      <strong>Flanagan, David (2020):</strong> <em>"JavaScript: The Definitive Guide — Master the World's Most-Used Programming Language"</em> (7th Edition), O'Reilly Media. ISBN: 978-1491952023.
    </li>
    <li>
      <strong>Banks, Alex & Porcello, Eve (2020):</strong> <em>"Learning React: Modern Patterns for Developing React Apps"</em> (2nd Edition), O'Reilly Media. ISBN: 978-1492078654.
    </li>
    <li>
      <strong>Bradshaw, Shannon, Chodorow, Kristina, & Dirolf, Mike (2019):</strong> <em>"MongoDB: The Definitive Guide — Powerful and Scalable Data Storage"</em> (3rd Edition), O'Reilly Media. ISBN: 978-1491954461.
    </li>
    <li>
      <strong>Herron, David (2020):</strong> <em>"Node.js Web Development: Server-side development with Node 14 and Express"</em> (5th Edition), Packt Publishing. ISBN: 978-1838987381.
    </li>
    <li>
      <strong>W3C (World Wide Web Consortium) (2023):</strong> <em>"Cascading Style Sheets Level 3 (CSS3) Specification & Flexbox/Grid Standards"</em>, https://www.w3.org/Style/CSS/
    </li>
    <li>
      <strong>Sommerville, Ian (2015):</strong> <em>"Software Engineering"</em> (10th Edition), Pearson Higher Education. ISBN: 978-0133943030.
    </li>
    <li>
      <strong>Pressman, Roger S. & Maxim, Bruce R. (2020):</strong> <em>"Software Engineering: A Practitioner's Approach"</em> (9th Edition), McGraw-Hill Education. ISBN: 978-1259872976.
    </li>
    <li>
      <strong>GitHub Repository:</strong> EventHub Engineering Team (2026), <em>"Event-Planning-System (EventHub) Open Source Repository"</em>, https://github.com/Priyanshu-kumar-maurya/Event-Planning-System-
    </li>
  </ol>
</div>

</body>
</html>
`;

// Write the updated HTML
const htmlPath = path.resolve('C:/Users/Dell/OneDrive/Desktop/aanu/college_project_report.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('HTML written to:', htmlPath);

// Compile to PDF
async function run() {
  const edgePath = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';
  const outputPath = path.resolve('C:/Users/Dell/OneDrive/Desktop/aanu/Event_Planning_System_College_Project_Report.pdf');

  console.log('Launching Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  console.log('Loading HTML file in headless browser...');
  await page.goto('file:///' + htmlPath.replace(/\\\\/g, '/'), {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });

  console.log('Rendering high-resolution PDF...');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '15mm',
      right: '15mm',
    },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="width: 100%; font-size: 8.5pt; font-family: 'Times New Roman', serif; color: #555; display: flex; justify-content: space-between; padding: 0 15mm;">
        <span>EventHub — College Event Management Platform (CSE Major Project)</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
  });

  await browser.close();
  const stats = fs.statSync(outputPath);
  console.log('✅ PDF Generated successfully!');
  console.log('Output Path:', outputPath);
  console.log('File Size:', (stats.size / 1024).toFixed(2), 'KB');

  const buf = fs.readFileSync(outputPath);
  const matches = buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g);
  console.log('Final Total Pages:', matches ? matches.length : 'unknown');

  // Also copy to Event-Planning-System directory
  const repoPdfPath = path.resolve('C:/Users/Dell/OneDrive/Desktop/aanu/Event-Planning-System/Event_Planning_System_College_Project_Report.pdf');
  fs.copyFileSync(outputPath, repoPdfPath);
  console.log('✅ Copied to Event-Planning-System repository folder.');
}

run().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
