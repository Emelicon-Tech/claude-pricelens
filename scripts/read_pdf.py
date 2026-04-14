import fitz
import sys
import json

def extract_pdf_data(pdf_path, out_path):
    print(f"Reading {pdf_path}...")
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        sys.exit(1)

    text = ""
    for page in doc:
        text += page.get_text()
    
    # Just dump the raw text for now so we can inspect it and figure out the exact schema/layout.
    # We'll split by lines to make it slightly organized.
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump({"lines": lines}, f, indent=2)
    
    print(f"Successfully extracted {len(lines)} lines to {out_path}.")

if __name__ == "__main__":
    extract_pdf_data("Product list.pdf", "pdf_output.json")
