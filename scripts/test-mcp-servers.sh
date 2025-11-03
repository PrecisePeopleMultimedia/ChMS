#!/bin/bash

# MCP Server Testing Script for ChMS
# This script tests all configured MCP servers to ensure they're working properly

echo "🧪 Testing ChMS MCP Servers..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test MCP server
test_mcp_server() {
    local server_name=$1
    local test_description=$2
    
    echo -e "${BLUE}Testing $server_name: $test_description${NC}"
    
    # Check if server is in the list
    if claude mcp list | grep -q "$server_name"; then
        echo -e "${GREEN}✓ $server_name is configured${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ $server_name is not configured${NC}"
        ((TESTS_FAILED++))
    fi
}

# Function to test Claude CLI
test_claude_cli() {
    echo -e "${BLUE}Testing Claude CLI installation...${NC}"
    
    if command -v claude &> /dev/null; then
        local version=$(claude --version)
        echo -e "${GREEN}✓ Claude CLI is installed: $version${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ Claude CLI is not installed${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Function to test API key
test_api_key() {
    echo -e "${BLUE}Testing API key configuration...${NC}"
    
    if claude config get api-key &> /dev/null; then
        local api_key=$(claude config get api-key)
        if [ "$api_key" != "null" ] && [ -n "$api_key" ]; then
            echo -e "${GREEN}✓ API key is configured${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${YELLOW}⚠ API key not configured${NC}"
            echo "  Run: claude auth login"
            ((TESTS_FAILED++))
        fi
    else
        echo -e "${YELLOW}⚠ API key not configured${NC}"
        echo "  Run: claude auth login"
        ((TESTS_FAILED++))
    fi
}

# Function to test project files
test_project_files() {
    echo -e "${BLUE}Testing ChMS project files...${NC}"
    
    local files=("package.json" "composer.json" "README.md" ".mcp.json")
    
    for file in "${files[@]}"; do
        if [ -f "$file" ] || [ -f "backend/$file" ] || [ -f "frontend/$file" ]; then
            echo -e "${GREEN}✓ Found $file${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${YELLOW}⚠ $file not found in expected locations${NC}"
            ((TESTS_FAILED++))
        fi
    done
}

# Run tests
echo -e "${YELLOW}Starting MCP Server Tests...${NC}"
echo

# Test 1: Claude CLI
test_claude_cli

# Test 2: API Key
test_api_key

# Test 3: Project Files
test_project_files

# Test 4: MCP Servers
echo -e "${BLUE}Testing configured MCP servers...${NC}"
test_mcp_server "supabase" "Database operations"
test_mcp_server "chrome-devtools" "Browser automation"
test_mcp_server "filesystem" "File operations"
test_mcp_server "git" "Version control"
test_mcp_server "postgres" "Database queries"
test_mcp_server "docker" "Container management"

# Display results
echo
echo "================================"
echo -e "${BLUE}Test Results Summary:${NC}"
echo -e "${GREEN}✓ Passed: $TESTS_PASSED${NC}"
echo -e "${RED}✗ Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! MCP setup is ready for ChMS development.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed. Please review the output above.${NC}"
    echo
    echo "Common fixes:"
    echo "1. Install Claude CLI: npm install -g @anthropic-ai/claude-code"
    echo "2. Configure API key: claude auth login"
    echo "3. Add missing MCP servers: ./scripts/setup-claude-mcp.sh"
    exit 1
fi
