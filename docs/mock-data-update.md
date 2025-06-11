# Mock Data Update - Abdul Rahman Family

## Overview
Updated mock family data to represent the Abdul Rahman family structure as provided in the family tree image.

## Family Structure

### Generation 1 (Grandparents)
- **Abdul Rahman** (Oman) - Born: 05 Jan 1960, Died: 08 Dec 2022
- **Zulmelia** (Bundo) - Born: 27 Jul 1962, Still alive

### Generation 2 (Children)
- **Dita Yunita Rahman** (Dita) - Born: 14 Jun 1992, Married to Laksmana
- **Laksmana Tri Moerdani** (Oci) - Born: 02 Nov 1984, Husband of Dita
- **Zulharman Maddani** (Arman) - Born: 01 Jan 1994, Single
- **Ismi Tri Oktaviani** (Ismi) - Born: 30 Oct 1996, Single

## Data Changes
1. Completely replaced previous Wijaya family data
2. Added proper spouse relationships between Abdul Rahman & Zulmelia
3. Added marriage connection between Dita & Laksmana
4. Set correct parent-child relationships
5. Added appropriate nicknames and birth dates
6. Configured proper generation levels

## TypeScript Improvements
- Fixed `any` types in ReactFlowTreeView with proper interfaces
- Added MemberUpdateData and NewMemberData interfaces
- Removed redundant React Fragment in MarriageEdge component

## Files Modified
- `/src/data/mockData.ts` - Complete data replacement
- `/src/components/FamilyTree/ReactFlowTreeView.tsx` - TypeScript fixes
- `/src/components/FamilyTree/edges/MarriageEdge.tsx` - Code quality fix
