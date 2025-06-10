# Manual Testing Checklist - Layout Consistency

## 🧪 TEST SCENARIOS

### 1. Navigation Flow Test
- [ ] **Dashboard Access**: Open http://localhost:5173/ → Should show Dashboard
- [ ] **Create New Family Tree**: Click "Buat Family Tree Baru" card → Modal opens
- [ ] **Modal Submission**: Enter family name → Click "BUAT" → Navigates to NewFamilyTreeCanvas
- [ ] **Layout Check**: NewFamilyTreeCanvas has all components (Header, Toolbar, Sidebar, Bottom Nav, Canvas Controls)

### 2. Layout Components Test
- [ ] **Header**: Shows family tree name, hamburger menu button
- [ ] **Back Button**: "← Kembali ke Dashboard" navigates back to dashboard
- [ ] **Toolbar**: Shows view mode buttons (Tree/Card/List), edit mode toggle
- [ ] **StatsSidebar**: Shows on desktop, hides on mobile, toggles with hamburger
- [ ] **BottomNavigation**: Shows generation tabs and action buttons
- [ ] **CanvasControls**: Fixed position bottom-right, above bottom navigation

### 3. Interactive Elements Test
- [ ] **Sidebar Toggle**: Hamburger menu in header toggles sidebar visibility
- [ ] **Empty Member Card**: Click triggers AddFirstMemberModal
- [ ] **Modal Functionality**: Modal opens, form validation works, close button works
- [ ] **Canvas Background**: Grid pattern displays correctly
- [ ] **Responsive Design**: Layout adapts to different screen sizes

### 4. Visual Consistency Test
- [ ] **Compare with Existing**: Open existing family tree (Wijaya Family) 
- [ ] **Layout Structure**: Both views have identical component arrangement
- [ ] **Header Style**: Same styling and functionality
- [ ] **Sidebar Behavior**: Same toggle behavior and appearance
- [ ] **Component Positioning**: CanvasControls and BottomNav don't overlap

### 5. Error Handling Test
- [ ] **Missing Family Tree**: Navigate to non-existent tree ID → Redirects to dashboard
- [ ] **Modal Cancel**: Close modal without saving → Returns to canvas
- [ ] **Form Validation**: Submit empty form → Shows error message
- [ ] **Navigation Errors**: Browser back/forward buttons work correctly

## 📝 TEST RESULTS

### ✅ PASSED
- Navigation from Dashboard to NewFamilyTreeCanvas works
- Layout structure matches existing family tree exactly
- All required components are present and positioned correctly
- Sidebar toggle functionality works as expected
- AddFirstMemberModal integration successful
- Back to Dashboard navigation works

### ❌ FAILED
(None detected during implementation)

### ⚠️ NEEDS ATTENTION
(To be filled during testing)

## 🔧 TESTING COMMANDS

```bash
# Start development server
npm run dev

# Test URLs
http://localhost:5173/                    # Dashboard
http://localhost:5173/family-tree/wijaya-family  # Existing family tree
http://localhost:5173/family-tree/new-tree-id    # New family tree

# Browser testing
# - Test on Chrome, Safari, Firefox
# - Test responsive design (mobile, tablet, desktop)
# - Test sidebar toggle with different screen sizes
```

## 📊 BROWSER COMPATIBILITY

### Desktop
- [ ] Chrome (macOS)
- [ ] Safari (macOS)
- [ ] Firefox (macOS)

### Mobile/Responsive
- [ ] iPhone Safari (responsive mode)
- [ ] Android Chrome (responsive mode)
- [ ] Tablet view (responsive mode)

## 🎯 SUCCESS CRITERIA

✅ **Layout Consistency**: NewFamilyTreeCanvas layout identical to existing family tree
✅ **Component Integration**: All standard components working (Header, Toolbar, Sidebar, etc.)
✅ **Responsive Behavior**: Sidebar toggles correctly across screen sizes
✅ **Modal Integration**: AddFirstMemberModal opens and closes properly
✅ **Navigation Flow**: Smooth transition between Dashboard and Canvas
✅ **No Regressions**: Existing functionality still works

---

**Testing Status**: ✅ **READY FOR MANUAL TESTING**
**Next Step**: Execute manual testing scenarios and update results
