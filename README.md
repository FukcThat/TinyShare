# TinyShare Roadmap

Current Commit: 👻🎃

- fixed reservation data issue leading to reservation conflicts
- moved community creation to mock api
- moved toggle role, kick member, accept/decline invites to mock api
- small fixes here and there
- HAPPY HALLOWEEN!

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

#### Community CRUD

[] Community Selection Dropdown
-- [x] On community change, show only items of members belonging to that community
-- [X] Handle no community, Navbar | Dropdown (Navbar spawns in dummy obj, if dummy obj is true hide navbar routes and redirect on manual page access)
-- [later] Local Storage user-preset active community
-- [x] Make dropdown universal component
[x] Create new Community
[] Update community Data
-- [x] Create Community Sidebar
-- [x] Move active Selection to Sidebar
-- [] Implement edit functionality in Sidebar if admin
-- [] Delete Community

#### Membership System

[x] Kick from community
[x] Update user role (member/admin)
[x] Accept / Decline invite\
[x] Leave community
[later] Invite to community

### Mock-API

[x] Create Basic Mock-API-Objects
[x] Move item page functionality to api
[x] move reservation logic to api
[x] fix conflict detection - issue with reservation data NOT conflict detection
[x] move community crud to api
[x] move membership crud to api - toggle, kick, leave, accept invite, decline invite
[x] loading state component

### Deletion

[ ] think about deletion and how that will work exactly (who can do it, what happens to dependencies, other things to think about?)
-- [] deleting items
-- [] deleting users
-- [] deleting communities
-- [] deleting reservation
-- [] deleting membership
