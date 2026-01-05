# Managing Website Content with phpMyAdmin

## 🎯 Quick Access

**cPanel → phpMyAdmin → Select your database**

You can manage all website content directly through phpMyAdmin without needing a custom admin panel.

---

## 📊 Database Tables Overview

Your website uses these tables:

| Table | Purpose | What You Can Edit |
|-------|---------|-------------------|
| `services` | Legal services | Title, description, icon, order |
| `team_members` | Team/attorneys | Name, role, bio, image, order |
| `page_sections` | Page content | Homepage, about page content |
| `inquiries` | Contact forms | View submissions (read-only) |

---

## 🔧 How to Edit Content

### 1. Edit Services

**To add a new service:**
1. Go to phpMyAdmin → `services` table
2. Click "Insert" tab
3. Fill in:
   - `title`: Service name (e.g., "Corporate Law")
   - `slug`: URL-friendly name (e.g., "corporate-law")
   - `description`: Service description
   - `icon`: Icon name (optional)
   - `is_active`: 1 (to show) or 0 (to hide)
   - `sort_order`: Number for ordering (1, 2, 3...)
4. Click "Go"

**To edit existing service:**
1. Go to `services` table
2. Click "Browse" tab
3. Click "Edit" (pencil icon) on the service
4. Make changes
5. Click "Go"

**To delete a service:**
1. Go to `services` table
2. Click "Browse" tab
3. Click "Delete" (X icon) on the service
4. Confirm deletion

**To reorder services:**
1. Edit the `sort_order` field
2. Lower numbers appear first (1, 2, 3...)

---

### 2. Edit Team Members

**To add a new team member:**
1. Go to phpMyAdmin → `team_members` table
2. Click "Insert" tab
3. Fill in:
   - `name`: Full name (e.g., "John Smith")
   - `role`: Position (e.g., "Senior Attorney")
   - `bio`: Short biography
   - `image`: Image URL (optional)
   - `is_active`: 1 (to show) or 0 (to hide)
   - `sort_order`: Number for ordering
4. Click "Go"

**To edit/delete:** Same process as services above

---

### 3. Edit Page Content

**Homepage Hero Section:**
1. Go to `page_sections` table
2. Find row where `key` = 'homepage_hero'
3. Click "Edit"
4. Edit the `data` field (JSON format):
```json
{
  "title": "Justicia Legal Minds",
  "subtitle": "Expert Legal Solutions",
  "buttonText": "Book Consultation",
  "buttonLink": "/contact"
}
```
5. Click "Go"

**About Page Content:**
1. Find row where `key` = 'about_content'
2. Edit the `data` field with your content
3. Click "Go"

---

### 4. View Contact Form Submissions

**To view inquiries:**
1. Go to `inquiries` table
2. Click "Browse" tab
3. View all submissions with:
   - Name, email, phone
   - Subject, message
   - Date submitted
   - Read/unread status

**To mark as read:**
1. Click "Edit" on the inquiry
2. Change `is_read` to 1
3. Click "Go"

**To delete spam:**
1. Click "Delete" (X icon)
2. Confirm deletion

---

## 💡 Quick Tips

### Bulk Operations

**Delete multiple items:**
1. Check boxes next to items
2. Scroll down, select "Delete" from dropdown
3. Click "Go"

**Export data (backup):**
1. Select table
2. Click "Export" tab
3. Choose format (SQL recommended)
4. Click "Go"

**Import data:**
1. Click "Import" tab
2. Choose file
3. Click "Go"

---

## 🔍 Useful SQL Queries

### View all active services:
```sql
SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order;
```

### View all team members:
```sql
SELECT * FROM team_members WHERE is_active = 1 ORDER BY sort_order;
```

### View unread inquiries:
```sql
SELECT * FROM inquiries WHERE is_read = 0 ORDER BY created_at DESC;
```

### Count total inquiries:
```sql
SELECT COUNT(*) as total FROM inquiries;
```

**To run a query:**
1. Click "SQL" tab in phpMyAdmin
2. Paste query
3. Click "Go"

---

## 🎨 Content Guidelines

### Services
- **Title:** Keep under 50 characters
- **Description:** 100-200 characters works best
- **Slug:** Use lowercase, hyphens (no spaces)
- **Sort Order:** Start from 1, increment by 1

### Team Members
- **Name:** Full name with title (e.g., "Dr. John Smith")
- **Role:** Job title/position
- **Bio:** 2-3 sentences maximum
- **Image:** Use square images (300x300px recommended)

### Page Sections
- **JSON Format:** Always use valid JSON
- **Test:** After editing, check website to verify changes

---

## ⚠️ Important Notes

### DO:
- ✅ Always backup before making bulk changes
- ✅ Test changes on a staging site first (if available)
- ✅ Keep `sort_order` numbers sequential
- ✅ Use valid JSON format for `page_sections`

### DON'T:
- ❌ Delete the `id` field
- ❌ Change `created_at` or `updated_at` fields
- ❌ Use special characters in `slug` fields
- ❌ Leave required fields empty

---

## 🚀 Common Tasks

### Add a New Service
1. phpMyAdmin → `services` → Insert
2. Fill: title, slug, description
3. Set `is_active` = 1
4. Set `sort_order` = (highest number + 1)
5. Save

### Hide a Service Temporarily
1. Find service in `services` table
2. Edit → Change `is_active` to 0
3. Save

### Reorder Services
1. Edit each service's `sort_order`
2. Lower numbers appear first
3. Example: 1, 2, 3, 4...

### Change Homepage Title
1. `page_sections` → Find 'homepage_hero'
2. Edit `data` JSON
3. Change "title" value
4. Save

---

## 📱 Mobile Access

phpMyAdmin works on mobile browsers:
1. Login to cPanel on mobile
2. Open phpMyAdmin
3. Use landscape mode for better view
4. Pinch to zoom if needed

---

## 🔐 Security Tips

1. **Always logout** after editing
2. **Use strong password** for cPanel
3. **Regular backups** - Export database weekly
4. **Limit access** - Don't share cPanel credentials

---

## 📞 Need Help?

**Common Issues:**

**Q: Changes don't appear on website?**
- Clear browser cache (Ctrl+F5)
- Check `is_active` = 1
- Verify no typos in data

**Q: JSON error in page_sections?**
- Use a JSON validator: jsonlint.com
- Check for missing quotes or commas
- Copy working example and modify

**Q: Can't find a table?**
- Make sure you selected the correct database
- Check database name in cPanel

---

## ✅ Summary

**To manage your website:**
1. **Login:** cPanel → phpMyAdmin
2. **Select:** Your database
3. **Edit:** Browse tables, click Edit/Insert/Delete
4. **Save:** Click "Go" to save changes
5. **Verify:** Check website to see changes

**No coding required!** All content management through simple forms in phpMyAdmin.

---

## 🎓 Video Tutorial

If you need visual guidance:
1. YouTube: "How to use phpMyAdmin"
2. Search: "phpMyAdmin edit database tutorial"
3. cPanel documentation: docs.cpanel.net

---

**That's it!** You now have full control over your website content through phpMyAdmin. No custom admin panel needed!
