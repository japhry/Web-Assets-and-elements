import sass
import sys

scss_path = r"C:\Users\Japhry\Downloads\Compressed\Web Assets and elements\ai-chat-layout\style.scss"

# read and sanitize SCSS to avoid incompatible units error (clamp with vw/rem)
with open(scss_path, 'r', encoding='utf-8') as f:
    scss_content = f.read()

# replace problematic clamp() expression with a fixed font-size
scss_content = scss_content.replace(
    'font-size: clamp(0.875rem, 0.8409rem + 0.1705vw, 1.25rem);',
    'font-size: 1rem;'
)

# compile from string
css = sass.compile(string=scss_content)
print(css[:1000])
