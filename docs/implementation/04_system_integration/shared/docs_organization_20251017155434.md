# Backend API - Documentation Organization

This backend-api directory now contains only essential project files. Documentation, reports, and generated files have been moved to appropriate locations:

## File Organization

### Essential Files (Kept in backend-api)
- **Project configuration**: `pyproject.toml`, `alembic.ini`, `Makefile`
- **README**: Main project documentation
- **Source code**: `src/` directory with all application code
- **Tests**: `tests/` directory
- **Scripts**: `scripts/` and generator scripts for development
- **Configuration**: `.env.example`, `.pre-commit-config.yaml`

### Moved to `docs/generated/`
- `API_DOCUMENTATION.md` - Auto-generated API docs
- `MODELS.md` - Generated model documentation
- `MODELS_COMPLETE.md` - Complete model listing
- `CRUD_MODULES_COMPLETE.md` - CRUD module documentation
- `QUICK_START.md` - Quick start guide
- `API_STRUCTURE.txt` - API structure overview
- `STRUCTURE_TREE.txt` - Project structure tree
- `작업검증.txt` - Work verification file

### Moved to `docs/reports/`
- `IMPLEMENTATION_REPORT.md` - Implementation completion report
- `작업완료보고서.md` - Korean completion report

## Backend-API Docs Folder

The `backend-api/docs/` folder still contains essential backend-specific documentation:
- Architecture and design documents
- Developer guides
- Module-specific documentation
- Changelog and version history

## Generating Documentation

When running generation scripts, output paths can be configured to write to the centralized docs folders:

```bash
# Example: Update scripts to output to docs/generated
python generate_models.py --output ../../docs/generated/MODELS.md
python generate_crud_modules.py --output ../../docs/generated/CRUD_MODULES.md
```

## .gitignore

The `.gitignore` file has been updated to exclude generated files and reports from version control in the backend-api directory, as they are now managed in the central docs folder.
