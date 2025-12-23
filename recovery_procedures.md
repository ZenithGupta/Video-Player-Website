# Disaster Recovery Guide: File Restoration

This guide documents the procedures for recovering files (e.g., `db.sqlite3`) from a Google Cloud Backup and DR disk backup.

## Prerequisites
- Access to Google Cloud Console (Backup and DR Service & Compute Engine).
- SSH access to your VM (`physioflex-main-server`).
- `Compute Admin` role (or sufficient permissions to create/attach disks).

---

## Phase 1: Restore Disk from Backup
1.  Navigate to **Google Cloud Console > Backup and DR > Vaulted resources**.
2.  Locate and click on your source disk (e.g., `physioflex-dev-server`).
3.  Scroll to the **Backups** list and identify the backup you want to restore (check the Date/Time).
4.  Click the **Restore** button (often under the 3-dot menu or "Actions").
5.  **Configure Restore:**
    - **Recovery type:** Select "New disk".
    - **Name:** Give it a clear name (e.g., `restore-temp-disk-2025-12-22`).
    - **Zone:** **Critical:** Must be the same zone as your VM (e.g., `asia-south1-b`).
    - **Project:** Select your current project.
6.  Click **Restore** and wait for the "Succeeded" status.

## Phase 2: Attach Disk to VM
1.  Navigate to **Compute Engine > VM instances**.
2.  Click on your VM (`physioflex-main-server`) to view details.
3.  Click **Edit**.
4.  Scroll to **Additional disks**.
5.  Click **+ ATTACH EXISTING DISK**.
6.  Select the `restore-temp-disk-...` you just created.
7.  Click **Save** at the bottom of the page.

## Phase 3: Mount & Recover Files (SSH)
Log into your VM via SSH and run the following commands:

### 1. Identify the new disk
It is usually the last one listed (e.g., `sdb` or `sdc`).
```bash
lsblk
# Look for a 10G disk (or your disk size) that is NOT mounted at /
```

### 2. Mount the partition
Create a temporary folder and mount the disk's main partition (usually `1`).
```bash
sudo mkdir -p /mnt/recovery_disk
sudo mount /dev/sdb1 /mnt/recovery_disk
```
*(Note: If `lsblk` showed `sdc`, use `/dev/sdc1`)*

### 3. Copy your files
Navigate or find your file. Example for recovering `db.sqlite3`:
```bash
# Find the file path if unsure
sudo find /mnt/recovery_disk -name "db.sqlite3"

# Copy it to your current directory (rename it to avoid overwriting current data!)
cp /mnt/recovery_disk/home/runner/Video-Player-Website/backend/db.sqlite3 ./db_recovered.sqlite3
```

## Phase 4: Cleanup (Mandatory)
**Do not skip this.** You will pay for the restored disk storage until you delete it.

### 1. Unmount and Detach
Inside the VM SSH:
```bash
sudo umount /mnt/recovery_disk
```

### 2. Detach from VM
1.  Go to **Compute Engine > VM instances**.
2.  **Edit** the VM.
3.  Click the **X** next to the restored disk to detach it.
4.  Click **Save**.

### 3. Delete the Disk
1.  Go to **Compute Engine > Storage > Disks**.
2.  Select the temporary disk (`restore-temp-disk-...`).
3.  Click **Delete**.
