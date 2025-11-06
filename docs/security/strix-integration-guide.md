# Strix Security Testing Integration Guide

## Overview

Strix is an AI-powered security testing tool that uses LLM agents to find vulnerabilities. This guide covers integrating Strix into ChMS for pre-production security audits.

## Revised Assessment

### ✅ **Points Validated**

1. **Docker Integration**: Already using Docker Compose - adding Strix is straightforward
2. **Local LLM Support**: Strix supports local LLMs via Ollama/LMStudio - no cloud API costs needed
3. **Timing**: Perfect for pre-production security audit before MVP launch

### 📊 **Updated Recommendation**

**Status**: ✅ **RECOMMENDED** for pre-production security audit

**When to Use**:
- Immediately before deploying MVP to production
- As part of pre-launch security checklist
- Periodic security audits (quarterly)

**Cost**: £0 (using local LLM) or minimal (GLM-4.6 cloud API if preferred)

---

## Local LLM Setup Options

### Option 1: Ollama (Recommended for AMD GPU)

**Why Ollama**:
- ✅ Native AMD GPU support via ROCm
- ✅ Easy installation and model management
- ✅ Compatible with Strix via `LLM_API_BASE`
- ✅ Free and open-source

**Installation**:
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull recommended model for security testing
ollama pull llama3.1:8b    # ~8GB VRAM required
# OR for better results (if you have VRAM):
ollama pull llama3.1:70b   # ~40GB VRAM required
# OR code-focused model:
ollama pull codellama:13b  # ~13GB VRAM required

# Start Ollama server
ollama serve
# Runs on http://localhost:11434 by default
```

**AMD GPU Requirements**:
- Install ROCm drivers for GPU acceleration
- Check compatibility: https://rocm.docs.amd.com/
- Minimum: 8GB VRAM for 8B models, 16GB+ recommended

**Model Recommendations**:
- **llama3.1:8b** - Best balance (8GB VRAM, good reasoning)
- **codellama:13b** - Code-focused, excellent for security testing (13GB VRAM)
- **mistral:7b** - Efficient, smaller footprint (7GB VRAM)

### Option 2: GLM-4.6

**Why GLM-4.6**:
- ✅ Affordable cloud API option
- ✅ Good performance for security testing
- ✅ No local setup required

**Setup**:
```bash
# If using GLM-4.6 cloud API
export STRIX_LLM="glm-4.6"
export LLM_API_KEY="your-glm-api-key"
export LLM_API_BASE="https://api.glm.ai/v1"  # Check actual endpoint
```

**Local GLM-4.6**:
- Check if GLM-4.6 supports local deployment
- May require CPU inference if AMD GPU support is limited
- Verify compatibility with Ollama or LMStudio

### Option 3: LMStudio (GUI Alternative)

**Why LMStudio**:
- ✅ User-friendly GUI
- ✅ Supports many model formats
- ✅ Easy model switching

**Setup**:
1. Download LMStudio: https://lmstudio.ai/
2. Download a compatible model (llama3.1, mistral, etc.)
3. Start local server in LMStudio
4. Configure Strix to use: `LLM_API_BASE=http://localhost:1234/v1`

---

## Docker Compose Integration

### Adding Ollama Service

Add to your `docker-compose.yml`:

```yaml
  # Ollama - Local LLM for Strix
  ollama:
    image: ollama/ollama:latest
    container_name: chms-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    networks:
      - chms-network
    # Note: For GPU support, you may need to add:
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia  # or rocm for AMD
    #           count: 1
    #           capabilities: [gpu]
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  # ... existing volumes ...
  ollama_data:
```

**Note**: GPU passthrough in Docker requires additional setup. For AMD GPUs, you may need to run Ollama on the host instead of in Docker.

### Alternative: Run Ollama on Host

If GPU passthrough is complex, run Ollama directly on your host:

```bash
# On your host machine (not in Docker)
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1:8b
ollama serve
# Accessible at http://localhost:11434
```

Then Strix (running in Docker or on host) can connect to `http://host.docker.internal:11434` or `http://localhost:11434`.

---

## Strix Installation & Configuration

### Install Strix

```bash
# Install via pipx (recommended)
pipx install strix-agent

# OR via pip
pip install strix-agent
```

### Configure for Local LLM

Create `.env.strix` or add to your environment:

```bash
# Using Ollama (local)
export STRIX_LLM="ollama/llama3.1:8b"
export LLM_API_BASE="http://localhost:11434/v1"
# No API key needed for local Ollama

# OR using GLM-4.6 (cloud)
export STRIX_LLM="glm-4.6"
export LLM_API_KEY="your-glm-api-key"
export LLM_API_BASE="https://api.glm.ai/v1"
```

### Run Security Scan

```bash
# Scan local codebase
strix --target ./backend

# Scan deployed application
strix --target http://localhost:8000

# Focused testing
strix --target ./backend \
  --instruction "Prioritize authentication, authorization, and SQL injection vulnerabilities"

# Non-interactive mode (for CI/CD)
strix -n --target ./backend
```

---

## Pre-Production Security Audit Workflow

### Step 1: Setup (One-time)

```bash
# 1. Install Ollama and pull model
ollama pull llama3.1:8b

# 2. Start Ollama server
ollama serve

# 3. Install Strix
pipx install strix-agent

# 4. Configure environment
export STRIX_LLM="ollama/llama3.1:8b"
export LLM_API_BASE="http://localhost:11434/v1"
```

### Step 2: Run Security Scan

```bash
# Before production deployment
cd /path/to/ChMS

# Scan backend code
strix --target ./backend \
  --instruction "Comprehensive security audit focusing on:
  - Authentication and authorization vulnerabilities
  - SQL injection and NoSQL injection
  - XSS and CSRF protection
  - API security and rate limiting
  - Data encryption and sensitive data exposure"

# Scan deployed staging environment
strix --target https://staging.your-domain.com \
  --instruction "Test deployed application for security vulnerabilities"
```

### Step 3: Review Results

Strix saves results in `agent_runs/<run-name>/`:
- Vulnerability reports
- Proof-of-concept exploits
- Remediation recommendations

### Step 4: Fix Critical Issues

Prioritize fixes based on:
1. **Critical**: Authentication bypass, SQL injection, data exposure
2. **High**: XSS, CSRF, privilege escalation
3. **Medium**: Rate limiting, input validation
4. **Low**: Information disclosure, minor misconfigurations

---

## AMD GPU Setup (ROCm)

### Install ROCm for Ollama

```bash
# Ubuntu/Debian
wget -qO - https://repo.radeon.com/rocm/rocm.gpg.key | sudo apt-key add -
echo 'deb [arch=amd64] https://repo.radeon.com/rocm/apt/debian/ ubuntu main' | sudo tee /etc/apt/sources.list.d/rocm.list
sudo apt update
sudo apt install rocm-dev

# Verify GPU detection
rocminfo
```

### Run Ollama with GPU

```bash
# Ollama should automatically detect AMD GPU with ROCm
ollama pull llama3.1:8b
ollama serve

# Check GPU usage
watch -n 1 rocm-smi
```

**Note**: If ROCm setup is complex, Ollama will fall back to CPU (slower but works).

---

## Model Size Recommendations

### For Moderate AMD GPU (8-16GB VRAM)

**Best Options**:
1. **llama3.1:8b** - 8GB VRAM, excellent for security testing
2. **codellama:13b** - 13GB VRAM, code-focused, great for security
3. **mistral:7b** - 7GB VRAM, efficient and capable

**Avoid**:
- Models > 13B parameters (unless you have 24GB+ VRAM)
- Quantized models may have reduced reasoning quality

### Performance Expectations

- **8B model**: ~10-30 seconds per vulnerability check
- **13B model**: ~20-60 seconds per vulnerability check
- **CPU fallback**: 2-5x slower than GPU

---

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Security Audit (Pre-Production)

on:
  workflow_dispatch:  # Manual trigger before production
  push:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Ollama
        run: |
          curl -fsSL https://ollama.com/install.sh | sh
          ollama pull llama3.1:8b
          ollama serve &
          sleep 10
      
      - name: Install Strix
        run: pipx install strix-agent
      
      - name: Run Security Scan
        env:
          STRIX_LLM: "ollama/llama3.1:8b"
          LLM_API_BASE: "http://localhost:11434/v1"
        run: |
          strix -n --target ./backend \
            --instruction "Comprehensive security audit"
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: security-report
          path: agent_runs/
```

---

## Cost Comparison

### Local LLM (Ollama)
- **Setup Cost**: £0
- **Running Cost**: £0 (electricity only)
- **Best For**: Regular testing, privacy-sensitive projects

### GLM-4.6 Cloud API
- **Setup Cost**: £0
- **Running Cost**: ~£0.01-0.05 per scan (depends on usage)
- **Best For**: One-off audits, when local setup is complex

### Cloud LLM (OpenAI GPT-4)
- **Setup Cost**: £0
- **Running Cost**: ~£0.50-2.00 per scan
- **Best For**: Highest quality results, enterprise audits

**Recommendation**: Start with local Ollama (free), upgrade to GLM-4.6 cloud if needed.

---

## Troubleshooting

### Ollama Not Detecting GPU

```bash
# Check ROCm installation
rocminfo

# Check Ollama GPU usage
OLLAMA_DEBUG=1 ollama serve

# Force CPU if GPU issues
OLLAMA_NUM_GPU=0 ollama serve
```

### Strix Can't Connect to Ollama

```bash
# Verify Ollama is running
curl http://localhost:11434/api/tags

# Check firewall/network
# If running in Docker, use host.docker.internal
export LLM_API_BASE="http://host.docker.internal:11434/v1"
```

### Model Too Slow

- Use smaller model (7B instead of 13B)
- Reduce context window
- Use quantized model (if available)
- Consider cloud API for faster results

---

## Next Steps

1. **Install Ollama** and pull `llama3.1:8b` model
2. **Test Strix** on a small test project first
3. **Run pre-production audit** before MVP launch
4. **Review and fix** critical vulnerabilities
5. **Schedule periodic audits** (quarterly recommended)

---

**Last Updated**: 2025-01-XX  
**Status**: Ready for pre-production security audit

