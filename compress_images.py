"""
Image Compression Script for MIRAS Website
Compresses images in assets/images folder to optimize website performance
"""

from PIL import Image
import os

def compress_image(input_path, output_path, quality=85, max_width=1920):
    """
    Compress an image while maintaining good quality
    
    Args:
        input_path: Path to input image
        output_path: Path to save compressed image
        quality: JPEG quality (1-100), 85 is good balance
        max_width: Maximum width to resize to
    """
    try:
        # Open image
        img = Image.open(input_path)
        
        # Convert RGBA to RGB if needed (for JPG)
        if img.mode == 'RGBA':
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize if too large
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        
        # Save with optimization
        img.save(output_path, 'JPEG', quality=quality, optimize=True)
        
        # Get file sizes
        original_size = os.path.getsize(input_path) / 1024  # KB
        compressed_size = os.path.getsize(output_path) / 1024  # KB
        reduction = ((original_size - compressed_size) / original_size) * 100
        
        print(f"✓ {os.path.basename(input_path)}")
        print(f"  Original: {original_size:.2f} KB")
        print(f"  Compressed: {compressed_size:.2f} KB")
        print(f"  Reduction: {reduction:.1f}%\n")
        
        return True
    except Exception as e:
        print(f"✗ Error compressing {input_path}: {e}")
        return False

def main():
    # Paths
    images_dir = r"c:\Users\HP\Desktop\MIRAS\assets\images"
    
    # Images to compress (Hero section images - most important)
    hero_images = ['hero.jpg', 'hero-bg.jpg']
    
    # Project images
    project_images = ['project1.png', 'project2.png', 'project3.png']
    
    # Team image
    other_images = ['team.png']
    
    all_images = hero_images + project_images + other_images
    
    print("=" * 60)
    print("MIRAS Image Compression")
    print("=" * 60 + "\n")
    
    compressed_count = 0
    
    for img_name in all_images:
        input_path = os.path.join(images_dir, img_name)
        
        if not os.path.exists(input_path):
            print(f"⚠ Skipping {img_name} - file not found\n")
            continue
        
        # Create backup
        backup_path = os.path.join(images_dir, f"{img_name}.backup")
        if not os.path.exists(backup_path):
            import shutil
            shutil.copy2(input_path, backup_path)
            print(f"📁 Backup created: {img_name}.backup")
        
        # Compress based on type
        if img_name in hero_images:
            # Hero images - high quality, max 1920px width
            success = compress_image(input_path, input_path, quality=90, max_width=1920)
        elif img_name in project_images:
            # Project images - good quality, max 800px width
            temp_jpg = input_path.replace('.png', '_compressed.jpg')
            success = compress_image(input_path, temp_jpg, quality=85, max_width=800)
            if success:
                os.remove(input_path)
                os.rename(temp_jpg, input_path.replace('.png', '.jpg'))
                print(f"  → Converted to JPG for better compression\n")
        else:
            # Other images - good quality
            success = compress_image(input_path, input_path, quality=85, max_width=1200)
        
        if success:
            compressed_count += 1
    
    print("=" * 60)
    print(f"✅ Compression Complete!")
    print(f"   Total images compressed: {compressed_count}/{len(all_images)}")
    print(f"   Backups saved with .backup extension")
    print("=" * 60)

if __name__ == "__main__":
    main()
