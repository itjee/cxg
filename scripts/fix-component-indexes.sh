#!/bin/bash

# Script to fix component index.ts files

FEATURES_DIR="/home/itjee/workspace/cxg/apps/tenants-web/src/features"
FIXED_COUNT=0
declare -a FEATURES_NO_COMPONENTS=()
declare -a SPECIAL_CASES=()

# Find all index.ts files in components directories
while IFS= read -r index_file; do
    COMPONENT_DIR=$(dirname "$index_file")

    # Get list of actual .tsx files (excluding index.ts)
    ACTUAL_FILES=$(find "$COMPONENT_DIR" -maxdepth 1 -name "*.tsx" -type f | sort)

    if [ -z "$ACTUAL_FILES" ]; then
        # No component files found
        FEATURE_PATH="${index_file#$FEATURES_DIR/}"
        FEATURES_NO_COMPONENTS+=("$FEATURE_PATH")
        continue
    fi

    # Read current index.ts
    if [ ! -f "$index_file" ]; then
        continue
    fi

    # Create a new index.ts content
    NEW_CONTENT=""

    # Process each actual .tsx file
    for tsx_file in $ACTUAL_FILES; do
        # Get filename without extension
        FILENAME=$(basename "$tsx_file" .tsx)

        # Convert filename to component name (PascalCase)
        # e.g., code-group-table -> CodeGroupTable
        COMPONENT_NAME=$(echo "$FILENAME" | sed -E 's/(^|-)([a-z])/\U\2/g')

        # Add export line
        NEW_CONTENT+="export { ${COMPONENT_NAME} } from './${FILENAME}'\n"
    done

    # Compare with current content
    CURRENT_CONTENT=$(cat "$index_file")
    NEW_CONTENT_FORMATTED=$(echo -e "$NEW_CONTENT" | sed '/^$/d')

    if [ "$CURRENT_CONTENT" != "$NEW_CONTENT_FORMATTED" ]; then
        # Write new content
        echo -e "$NEW_CONTENT" | sed '/^$/d' > "$index_file"
        ((FIXED_COUNT++))
        echo "Fixed: $index_file"
    fi

done < <(find "$FEATURES_DIR" -type f -name "index.ts" -path "*/components/index.ts")

echo ""
echo "===== SUMMARY ====="
echo "Fixed $FIXED_COUNT index.ts files"
echo ""

if [ ${#FEATURES_NO_COMPONENTS[@]} -gt 0 ]; then
    echo "Features with components directory but no .tsx files:"
    for feature in "${FEATURES_NO_COMPONENTS[@]}"; do
        echo "  - $feature"
    done
fi
