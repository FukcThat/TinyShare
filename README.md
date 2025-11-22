# TinyShare Roadmap

Current Commit: 16.11.2025

- Added custom Auth UI (Sign In, Sign Up, Reset Password)
- Implemented update password on recovery/invite
- Refactor done

### Reservation and Booking System

[66%] Request a new booking by clicking start and end on the calander
-- [x] check that no reservations lie between those dates
-- [x] intuitively set start & end time by clicking the calendar
-- [later] && by setting start & end time by input
-- [later] Datetime picker library integration
-- [x] creating reservation
-- [x] Cancel Booking from requester view
[50%] Owners side of booking
-- [x] Accept/Deny Booking
-- [later] Update booking time
[x] Search/Filter Items by status and other things to find free items in your needed timeline
[x] Availablitiy functionality (when is not available, new bookings cannot be made but standing bookings are upheld)

#### Bug-Report:

[x] Letting owner of item cancel existing booking
[x] timeText passed on both first and last day of booking, fix it to only be one or the other
[x] edit item and new item form share state leading to weird behavior, fix this

### Admin System

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

### Supabase Integration

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
[] Integrate React Query into server state hooks for caching
