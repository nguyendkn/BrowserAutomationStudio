# Contributing to BrowserAutomationStudio

Thank you for your interest in contributing to BrowserAutomationStudio! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Contribution Types](#contribution-types)
- [Submission Guidelines](#submission-guidelines)
- [Review Process](#review-process)

## 🤝 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background, experience level, or identity.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing private information without permission
- Any conduct that would be inappropriate in a professional setting

## 🚀 Getting Started

### Prerequisites
Before contributing, ensure you have:
- Read the [Setup Guide](../Setup/README.md)
- Familiarized yourself with the [Architecture](../Architecture/README.md)
- Reviewed the [Coding Standards](../CodingStandards/README.md)
- Set up your development environment

### Finding Issues to Work On
1. Check the [Issues](https://gitlab.com/bablosoft/bas/-/issues) section
2. Look for issues labeled:
   - `good first issue` - Suitable for newcomers
   - `help wanted` - Community assistance needed
   - `bug` - Bug fixes needed
   - `enhancement` - New features or improvements

### Claiming an Issue
1. Comment on the issue expressing your interest
2. Wait for maintainer confirmation
3. Ask questions if the requirements are unclear
4. Provide an estimated timeline for completion

## 🔄 Development Process

### 1. Fork and Clone
```bash
# Fork the repository on GitLab
# Clone your fork
git clone https://gitlab.com/yourusername/bas.git
cd bas

# Add upstream remote
git remote add upstream https://gitlab.com/bablosoft/bas.git
```

### 2. Create Feature Branch
```bash
# Update your main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Follow the [Coding Standards](../CodingStandards/README.md)
- Write tests for new functionality
- Update documentation as needed
- Ensure code compiles without warnings

### 4. Test Your Changes
```bash
# Run unit tests
cd build
ctest

# Run integration tests
# Test manually with sample scripts
# Verify no regressions in existing functionality
```

### 5. Commit Changes
```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat(component): add new automation feature

- Implement new action for form handling
- Add validation for input parameters
- Include unit tests and documentation

Fixes #123"
```

### 6. Push and Create Merge Request
```bash
# Push to your fork
git push origin feature/your-feature-name

# Create merge request on GitLab
# Fill out the merge request template
# Link to related issues
```

## 🎯 Contribution Types

### Bug Fixes
- **Priority**: High
- **Requirements**: 
  - Clear reproduction steps
  - Root cause analysis
  - Minimal, focused fix
  - Regression tests

**Example**:
```cpp
// Before: Memory leak in resource handler
ResourceHandler::~ResourceHandler() {
    // Missing cleanup
}

// After: Proper cleanup
ResourceHandler::~ResourceHandler() {
    CleanupResources();
    qDeleteAll(_allocatedObjects);
    _allocatedObjects.clear();
}
```

### New Features
- **Priority**: Medium
- **Requirements**:
  - Feature proposal discussion
  - Design document for complex features
  - Comprehensive tests
  - Documentation updates

**Process**:
1. Create feature proposal issue
2. Discuss design with maintainers
3. Implement with tests
4. Update documentation

### Documentation Improvements
- **Priority**: Medium
- **Requirements**:
  - Clear, accurate information
  - Proper formatting and structure
  - Examples where appropriate
  - Spell-check and grammar review

### Module Development
- **Priority**: Medium
- **Requirements**:
  - Follow module development guidelines
  - Include manifest and all required files
  - Provide usage examples
  - Test with various scenarios

### Performance Improvements
- **Priority**: Low-Medium
- **Requirements**:
  - Benchmark before and after
  - Profiling data to support changes
  - No functional regressions
  - Documentation of performance gains

## 📝 Submission Guidelines

### Merge Request Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issues
Fixes #(issue number)
Related to #(issue number)

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Performance impact assessed

## Documentation
- [ ] Code comments added/updated
- [ ] API documentation updated
- [ ] User documentation updated
- [ ] README updated if needed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] No new compiler warnings
- [ ] All tests pass
- [ ] No breaking changes (or clearly documented)

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information or context about the changes.
```

### Commit Message Format
```
type(scope): brief description

Detailed description of changes if necessary.
Include motivation and context for the change.

Breaking Changes: describe any breaking changes
Fixes #issue_number
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Scopes**:
- `engine`: Core engine changes
- `studio`: Studio application changes
- `chromeworker`: Browser worker changes
- `scheduler`: Scheduler component changes
- `modules`: Module system changes
- `docs`: Documentation changes

### Code Quality Requirements

#### C++ Code
- Follow [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/)
- Use RAII for resource management
- Prefer smart pointers over raw pointers
- Include proper error handling
- Add comprehensive comments

#### JavaScript Code
- Use modern ES6+ features appropriately
- Follow consistent naming conventions
- Include JSDoc comments for functions
- Handle errors gracefully
- Validate input parameters

#### Testing Requirements
- Unit tests for all new functionality
- Integration tests for component interactions
- Performance tests for optimization changes
- Manual testing documentation

## 🔍 Review Process

### Review Criteria
Reviewers will evaluate:

1. **Functionality**: Does the code work as intended?
2. **Code Quality**: Is the code well-written and maintainable?
3. **Testing**: Are there adequate tests?
4. **Documentation**: Is the code properly documented?
5. **Performance**: Are there any performance implications?
6. **Security**: Are there any security concerns?

### Review Timeline
- **Initial Review**: Within 3-5 business days
- **Follow-up Reviews**: Within 1-2 business days
- **Final Approval**: After all feedback is addressed

### Addressing Feedback
1. Read all feedback carefully
2. Ask questions if anything is unclear
3. Make requested changes
4. Update tests and documentation as needed
5. Respond to each comment when resolved

### Merge Requirements
Before merging, ensure:
- [ ] All review feedback addressed
- [ ] All tests passing
- [ ] No merge conflicts
- [ ] Documentation updated
- [ ] Maintainer approval received

## 🏆 Recognition

### Contributor Recognition
- Contributors are listed in project documentation
- Significant contributions are highlighted in release notes
- Active contributors may be invited to join the maintainer team

### Types of Recognition
- **Code Contributors**: Direct code contributions
- **Documentation Contributors**: Documentation improvements
- **Community Contributors**: Helping others, reporting issues
- **Module Contributors**: Creating and maintaining modules

## 📞 Getting Help

### Communication Channels
- **Issues**: For bug reports and feature requests
- **Merge Requests**: For code review discussions
- **Community Forum**: For general questions and discussions
- **Email**: For private or sensitive matters

### Mentorship
New contributors can request mentorship:
- Guidance on development setup
- Code review and feedback
- Best practices and conventions
- Project architecture understanding

### Resources
- [Development Guide](./README.md)
- [Architecture Documentation](../Architecture/README.md)
- [API Reference](../API/README.md)
- [Examples and Tutorials](../Examples/README.md)

---

*Thank you for contributing to BrowserAutomationStudio! Your contributions help make the project better for everyone.*
