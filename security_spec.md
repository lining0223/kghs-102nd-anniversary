# Firestore Security Specification

## 1. Data Invariants
- Public users (unauthenticated students, teachers, guests) have read-only access to `/celebration/{docId}` and `/test/{testId}`.
- All write operations (`create`, `update`, `delete`) on `/celebration/{docId}` require an authenticated and verified administrator (`isAdmin()`).
- The bootstrapped administrator email is `s114017@ms2.kghs.kh.edu.tw` and must have `email_verified == true`.
- Document IDs must conform to `isValidId()` (`^[a-zA-Z0-9_\\-]+$`, length <= 128).
- The default deny catch-all `match /{document=**} { allow read, write: if false; }` prevents unauthorized access to any unspecified paths.
- Administrators cannot escalate privileges or assign roles arbitrarily.

## 2. The "Dirty Dozen" Payloads (Must return PERMISSION_DENIED)
1. **Unauthenticated Write**: An unauthenticated user attempts to overwrite `/celebration/main`.
2. **Unverified Email Spoofing**: An authenticated user with email `s114017@ms2.kghs.kh.edu.tw` but `email_verified == false` attempts to update `/celebration/main`.
3. **Arbitrary User Write**: An authenticated normal user (`student@example.com`) attempts to update celebration data.
4. **ID Poisoning / Denial of Wallet Attack**: Document ID with 2000 characters or illegal regex characters sent to `/celebration/{docId}`.
5. **Ghost Field Injection**: Attempt to inject unauthorized RBAC fields (e.g., `isAdmin: true`, `role: 'superadmin'`) into celebration content.
6. **Negative Timestamp Injection**: Setting `updatedAt` to an invalid type or negative number.
7. **Admins Collection Unauthorized Read**: Non-admin user querying `/admins` collection to enumerate administrator emails.
8. **Admins Collection Self-Elevation**: Regular authenticated user creating `/admins/{uid}` with `role: 'superadmin'`.
9. **Catch-All Bypass Attempt**: Attempt to read or write to arbitrary subcollections like `/internal/secrets`.
10. **Test Document Malicious Write**: Unauthenticated user attempting to write or delete `/test/connection`.
11. **Type Poisoning Attack**: Passing an array where `updatedAt` is expected to be a number.
12. **Malformed Payload Without Required Fields**: Update payload missing required fields or violating schema constraints.
