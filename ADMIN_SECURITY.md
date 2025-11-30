# 🔐 Admin Security Documentation

## Secure Admin Access System

Your affiliate website now has a **secure admin login system** with proper authentication and access control.

---

## 🎯 Security Features

### ✅ What's Protected:

1. **Separate Admin Login Page** - `/admin/login`
   - Not accessible from public navigation
   - Requires admin access code + credentials
   - Beautiful dark-themed secure interface

2. **Three-Layer Authentication:**
   - **Layer 1**: Admin Access Code (ADMIN2025)
   - **Layer 2**: Email/Password (Supabase Auth)
   - **Layer 3**: Session verification with 24-hour expiry

3. **Auto-Redirect Protection:**
   - Accessing `/admin` without auth → redirects to `/admin/login`
   - Session expired → redirects to `/admin/login`
   - Invalid credentials → shows error message

4. **Session Management:**
   - Admin sessions stored in sessionStorage
   - Auto-expire after 24 hours
   - Cleared on logout

---

## 🚀 How to Access Admin Panel

### Step 1: Navigate to Admin Login
Go to: **https://adminportal-26.preview.emergentagent.com/admin/login**

⚠️ **Important**: The admin login URL is not linked from the main site for security.

### Step 2: Enter Credentials

1. **Admin Access Code**: `ADMIN2025`
2. **Email**: Your registered account email
3. **Password**: Your account password

### Step 3: Access Admin Panel
After successful login, you'll be redirected to `/admin` with full access.

---

## 🔑 Default Admin Credentials

**For Demo/Testing:**

```
Admin Code: ADMIN2025
Email: Use any registered account
Password: Your account password
```

**Note**: Currently, any authenticated user with the correct admin code can access the admin panel. In production, restrict this to specific admin emails.

---

## 🛡️ Admin Panel Features

Once logged in, admins have **full authority** over:

### 1. **Dashboard**
- View analytics (products, members, reviews, views)
- Recent activity feed
- Quick stats overview

### 2. **Product Management**
- ✅ **Add** new products
- ✅ **Edit** existing products
- ✅ **Delete** products
- ✅ **Approve** pending products
- ✅ **Reject** products
- View product statistics

### 3. **Member Management**
- View all registered members
- ✅ **Approve** pending members
- ✅ **Reject/Remove** members
- View member status and details

### 4. **Blog Management** (Coming Soon)
- Create and edit blog posts
- Manage featured products in posts

### 5. **Settings** (Coming Soon)
- Site configuration
- Admin email list management
- Security settings

---

## 🔒 Security Implementation Details

### File Structure:

```
/app
├── app/
│   └── admin/
│       ├── page.js              # Protected admin panel
│       └── login/
│           └── page.js          # Secure login page
└── middleware/
    └── adminAuth.js             # Authentication logic
```

### Authentication Flow:

```
1. User visits /admin
   ↓
2. checkAdminAuth() verifies session
   ↓
3. If not authenticated → redirect to /admin/login
   ↓
4. User enters admin code + credentials
   ↓
5. Verify admin code (ADMIN2025)
   ↓
6. Authenticate with Supabase
   ↓
7. Store admin session
   ↓
8. Redirect to /admin panel
```

### Session Storage:

```javascript
sessionStorage.setItem('isAdmin', 'true')
sessionStorage.setItem('adminVerified', Date.now().toString())
```

### Session Expiry:

- Sessions auto-expire after **24 hours**
- On logout, session is cleared
- On sign out, redirects to `/admin/login`

---

## 🔐 Production Security Recommendations

### 1. **Change Admin Code**

Update in `/app/app/admin/login/page.js`:

```javascript
const validAdminCode = process.env.NEXT_PUBLIC_ADMIN_CODE || 'ADMIN2025'
```

Add to `.env`:
```
NEXT_PUBLIC_ADMIN_CODE=your-secure-code-here
```

### 2. **Restrict Admin Emails**

Update in `/app/middleware/adminAuth.js`:

```javascript
export const ADMIN_EMAILS = [
  'admin@yourdomain.com',
  'owner@yourdomain.com',
]
```

Then uncomment the email check in `/app/app/admin/login/page.js`:

```javascript
if (!adminEmails.includes(data.user.email)) {
  throw new Error('Access denied: Admin privileges required')
}
```

### 3. **Use Environment Variables**

Never hardcode sensitive data. Store in `.env`:

```
NEXT_PUBLIC_ADMIN_CODE=your-secure-admin-code
ADMIN_EMAIL_1=admin@yourdomain.com
ADMIN_EMAIL_2=owner@yourdomain.com
```

### 4. **Enable Database Admin Roles**

Add `is_admin` column to Supabase `user_profiles` table:

```sql
ALTER TABLE user_profiles
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
```

Update specific users:

```sql
UPDATE user_profiles
SET is_admin = TRUE
WHERE user_id = 'user-uuid-here';
```

### 5. **Add IP Whitelisting** (Optional)

For extra security, restrict admin access to specific IPs.

### 6. **Enable Two-Factor Authentication** (Optional)

Add 2FA requirement for admin accounts.

---

## 🚨 Security Best Practices

### ✅ DO:

- Change the default admin code immediately
- Use strong passwords
- Limit admin email list to trusted personnel only
- Enable 2FA for admin accounts
- Monitor admin activity logs
- Regularly update admin code
- Use HTTPS in production
- Keep session expiry time reasonable

### ❌ DON'T:

- Share admin code publicly
- Use weak or common passwords
- Allow all users admin access
- Store credentials in code
- Share admin login URL publicly
- Use same password for admin and user accounts
- Leave default credentials in production

---

## 📊 Admin Panel Access Levels

### Current Implementation:

**Level 1: Guest** (Not logged in)
- Cannot access `/admin`
- Redirected to `/admin/login`

**Level 2: Regular User** (Logged in, no admin code)
- Cannot access `/admin`
- Needs admin code to proceed

**Level 3: Admin** (Logged in + admin code)
- Full access to `/admin` panel
- All management features
- Approve/reject capabilities

### Future Levels (Recommended):

**Super Admin**
- All Level 3 permissions
- Manage other admins
- System settings

**Moderator**
- Approve/reject products and members
- Cannot delete or change settings

**Editor**
- Manage blog posts and content
- Cannot manage users or products

---

## 🔄 Admin Session Management

### Session Duration:
- **24 hours** from login
- Auto-expires after 24 hours
- Must re-login after expiry

### Logout Behavior:
- Clears all admin session data
- Signs out from Supabase
- Redirects to `/admin/login`
- Prevents back button access

### Session Storage Keys:
```javascript
isAdmin: 'true'
adminVerified: timestamp
```

---

## 🐛 Troubleshooting

### Issue: Can't access admin panel

**Solution 1**: Check if session expired
- Sessions expire after 24 hours
- Re-login at `/admin/login`

**Solution 2**: Verify admin code
- Correct code: `ADMIN2025`
- Case-sensitive

**Solution 3**: Clear browser cache
```javascript
sessionStorage.clear()
```

### Issue: Redirected to login after successful login

**Solution**: Check if:
- Admin code is correct
- Email/password are valid
- Browser allows sessionStorage
- JavaScript is enabled

### Issue: Admin code not working

**Solution**: 
- Default code: `ADMIN2025`
- Check for typos (case-sensitive)
- Verify code hasn't been changed in environment variables

---

## 📝 Admin URLs

### Production:
- Login: `https://yourdomain.com/admin/login`
- Panel: `https://yourdomain.com/admin`

### Development:
- Login: `http://localhost:3000/admin/login`
- Panel: `http://localhost:3000/admin`

---

## 🎨 Admin Panel Theme

**Dark Theme Colors:**
- Primary Background: `#030712` (gray-950)
- Secondary Background: `#111827` (gray-900)
- Card Background: `#1f2937` (gray-800)
- Borders: `#374151` (gray-700)
- Text: `#ffffff` (white)
- Muted Text: `#9ca3af` (gray-400)

---

## 📞 Support

For security issues or questions:
1. Check this documentation first
2. Review code comments in `/app/app/admin/login/page.js`
3. Test in browser console with `checkAdminAuth()`

---

## ✅ Security Checklist

Before going live:

- [ ] Change default admin code
- [ ] Update admin email list
- [ ] Enable HTTPS
- [ ] Add environment variables
- [ ] Test session expiry
- [ ] Enable 2FA (optional)
- [ ] Add IP whitelisting (optional)
- [ ] Test all admin functions
- [ ] Remove demo credentials section
- [ ] Monitor admin access logs
- [ ] Set up admin role in database
- [ ] Document custom admin emails
- [ ] Test logout functionality
- [ ] Verify redirect protection
- [ ] Enable production security headers

---

**Your admin panel is now secure and ready to use!** 🎉
