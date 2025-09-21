# ✍️ Blogging Platform

A clean, fast, and feature-rich **Blogging Frontend SPA** that allows users to explore, filter, and search blogs with ease. Designed with modern frontend practices, responsive layout, and performance in mind.

---

## 📌 Purpose

This project was built to demonstrate:
- Advanced filtering and search techniques in UI
- Real-world SPA use cases using React
- Clean UI/UX patterns with pagination and conditional rendering
- Accessibility and performance best practices
- Backend Integretion

---

## ⚙️ Technologies Used

- **React.js** – Component-based UI framework  
- **JavaScript (ES6+)** – Logic and functional code  
- **React-Router** – Client-side routing  
- **HTML5 & CSS3** – Semantic structure and styling  
- **Mock Data (JSON / Local)** – Blog content  
- **Lighthouse** – Performance and accessibility audits

---

## 🚀 Key Features

✅ **Tag-Based Filtering**
- Choose one or more tags to filter blogs
- Supports **AND** (match all tags) and **OR** (match any tag) filter modes

✅ **Search Functionality**
- Enter minimum 3 characters to trigger search
- Searches across blog title and content
- Highlights matching terms in the list

✅ **Pagination**
- Displays 10 blogs per page
- Dynamic navigation with previous/next support
- Optimized for performance with lazy rendering

✅ **Stats**
- Now users can like the blog, see the views and who wrote that blog and readtime

✅ **Responsive Design**
- Works seamlessly on mobile, tablet, and desktop
- Accessible and keyboard-navigable

✅ **Performance Optimized**
- Lighthouse Scores:
  - **Performance**: 99%
  - **Accessibility**: 100%
  - **Best Practices**: 96%
  - **SEO**: 100%
 
✅ **Theme Toggler**
- Toggle between Dark and Light Theme at user's convienence

✅ **Newsletter Subscription**
- Now readers can able to subscribe to the Blog's newsletter
- Readers can also choose subscription type like:
  - All : Newsletter will be sent for every blog posted
  - Tech : Receives newsletter when technical blogs posted
  - Personal : Receives newsletter for Personal blogs

✅ **Clean UI Feedback**
- Empty results messages
- Loading indicators
- Highlighting for matching search terms

---

## 🧠 Implementation Highlights

- **Debounced search** using `useEffect` and `setTimeout`
- **Memoized filter logic** with `useMemo` to improve performance
- State managed using `useState`, and `useReducer` if needed for filter modes
- Modular components: BlogCard, Pagination, TagSelector, SearchBar, etc.
- Utility functions to handle tag combinations and filtering logic

---
## ✨ Future Enhancements

- [x] Backend API integration (Node/Express, Postgres)
- [x] Admin dashboard for blog publishing
- [x] Commenting and Like system
- [ ] Markdown editor for blog creation
- [x] Dark mode toggle

---
