# TinyShare Roadmap

Todos:

-[x] Item is Currently booked function returns true or false and can be used on profile page, item page 
-[x] Item Edit Delete
-[x] Item Description CRUD, Image CRUD
--[x] Item Desc CRUD
--[x] Max Length on Input validation frontend and backend? [30 min]
-[x] Calendar Day 
--[x] Image CRUD 
--[x] Calendar Legend [30 min]
-[x] Community Page, info, edit, delete, members with role toggle, admin panel invite/settings 

-[s] Homepage invites, item list view of active community with search and filters [7.Jan]
--[x] item list view search (name, desc, owner name), availability filter [90 min]
--[] Seperate Data hooks for users items including cache invalidations on item and reservation crud [90 min]

-[r] General Refactor of code, light mode  [8-9.Jan]
--[] Seperate Data hook for user item reservations (including cache invalidations whenever reservations change or when items get deleted)
-[l] Icons, Style Consistency / Loading States [10.Jan]
-[t] Hosting [11.Jan]

-[x] Profile Page
--[x] Show if items are currently booked or not with small badge
-[x] Item Page
--[x] Image CRUD
--[x] item description CRUD 
--[x] Edit/Delete Item if owner
--[x] Currently booked badge
--[x] Calendar legend 
--[x] Currently Booked Status in the booking form
-[s] Home Page
--[s] Invites
--[i] Active Bookings
--[i] My Booked Items
--[s] Item List View of active community
-[x] Community Page
--[x] Community Info
--[x] Community Info Edit if admin
--[x] Community Members List / role toggle and kicks for admin
--[x] Admin Panel Invites
--[x] Admin Panel Settings

### Issues

Current Commit: TanStack Query Integration

- [x] User Profile Data
- [x] User Communities Data
- [x] User Invitation Data (invalidate when accepting invitation)
- [x] Community Member Data (invalidate when member kicked that isnt you)
- [x] Community Invite Data
- [x] Community Item Data
- [x] Realtime Issue with Community Items

### Reservation and Booking System [70%]

[66%] Request a new booking by clicking start and end on the calander
-- [x] check that no reservations lie between those dates
-- [x] intuitively set start & end time by clicking the calendar
-- [later] && by setting start & end time by input
-- [later] Datetime picker library integration
-- [x] creating reservation
-- [x] Cancel Booking from requester view
[x] Owners side of booking
-- [x] Accept/Deny Booking
[x] Search/Filter Items by status and other things to find free items in your needed timeline
[x] Availablitiy functionality (when is not available, new bookings cannot be made but standing bookings are upheld)

#### Bug-Report:

[x] Letting owner of item cancel existing booking
[x] timeText passed on both first and last day of booking, fix it to only be one or the other
[x] edit item and new item form share state leading to weird behavior, fix this

### Admin System [x]

#### Community CRUD [X]

[x] Community Selection Dropdown
-- [x] On community change, show only items of members belonging to that community
-- [X] Handle no community, Navbar | Dropdown (Navbar spawns in dummy obj, if dummy obj is true hide navbar routes and redirect on manual page access)
-- [x] Local Storage user-preset active community
-- [x] Make dropdown universal component
[x] Create new Community
[x] Update community Data
-- [x] Create Community Sidebar
-- [x] Move active Selection to Sidebar
-- [x] Implement edit functionality in Sidebar if admin
-- [x] Delete Community

#### Membership System [x]

[x] Kick from community
[x] Update user role (member/admin)
[x] Accept / Decline invite\
[x] Leave community
[x] Invite to community

### Mock-API [x]

[x] Create Basic Mock-API-Objects
[x] Move item page functionality to api
[x] move reservation logic to api
[x] fix conflict detection - issue with reservation data NOT conflict detection
[x] move community crud to api
[x] move membership crud to api - toggle, kick, leave, accept invite, decline invite
[x] loading state component

### Supabase Integration [100%]

[x] Auth
----[x] Login
----[x] sign up
----[x] verify email page
----[x] reset password form
----[x] on sign in, if password not set, set password [type = invite, recovery ]
----[x] reset password page for invite
----[x] reset password page for recovery
----[x] refactor and check useSessionProvider with jipity
[x] Reservation CRUD
----[x] Submit Reservation // anyone who is a member of overlapping communities can create the reservation
----[x] Accept Reservation //only item owner or person who reserve can update/delete
----[x] Cancel/Deny Reservation //only item owner or person who reserve can update/delete
[X] Invitation CRUD
----[x] Accept Invite // invitee or inviter can update
----[x] Decline Invite // invitee or inviter can delete
----[x] Rescind Invite // inviter or inviter can delete
----[x] Invite User // member of community can create invitation
----[x] Handle Send Invite Form
[x] Membership CRUD
----[x] Kick // only admins of communities RLS
----[x] Toggle Role // only admins of communities RLS, cannot toggle your own
[x] User CRUD
----[x] Log Out Btn
----[x] Profile Info
----[x] Change Display Name
[x] Community CRUD
----[x] Create New Community
----[x] Edit Community Details
----[X] Delete Community - on last member leave
----[x] Default Community Handling via localstorage
[x] Realtime Integration
----[x] Split up the global session db call into 3 for items, invitations and members
----[x] create custom hook for realtime and db call
[x] Integrate React Query into server state hooks for caching

### Styling [0%]

### Finishing Touches [0%]

#### Handle Errors

#### Future Features
