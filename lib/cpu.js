// arch cleansing
const ARCH_TYPES = {
  arm64: 'ARM-64',
  arm: 'ARM',
  x86: 'X86',
  x86_64: 'X86_64'
};

// type information
const CPU_TYPE_ARM = 12;
const CPU_ARCH_ABI64 = 0x01000000;
const CPU_TYPE_ARM64 = CPU_TYPE_ARM | CPU_ARCH_ABI64;
const CPU_TYPE_X86 = 7;
const CPU_TYPE_X86_64 = CPU_TYPE_X86 | CPU_ARCH_ABI64;

// type version numbers
const CPU_SUBTYPE_ARM_V6 = 6;
const CPU_SUBTYPE_ARM_V7 = 9;
const CPU_SUBTYPE_ARM_V7F = 10;
const CPU_SUBTYPE_ARM_V7S = 11;
const CPU_SUBTYPE_ARM_V7K = 12;
const CPU_SUBTYPE_ARM_V6M = 14;
const CPU_SUBTYPE_ARM_V7M = 15;
const CPU_SUBTYPE_ARM_V7EM = 16;
const CPU_SUBTYPE_ARM_V8 = 13;

// type lookup index
const CPU_ARM_TYPES = {
  [CPU_SUBTYPE_ARM_V6]: 'armv6',
  [CPU_SUBTYPE_ARM_V7]: 'armv7',
  [CPU_SUBTYPE_ARM_V7F]: 'armv7f',
  [CPU_SUBTYPE_ARM_V7S]: 'armv7s',
  [CPU_SUBTYPE_ARM_V7K]: 'armv7k',
  [CPU_SUBTYPE_ARM_V6M]: 'armv6m',
  [CPU_SUBTYPE_ARM_V7M]: 'armv7m',
  [CPU_SUBTYPE_ARM_V7EM]: 'armv7em',
  [CPU_SUBTYPE_ARM_V8]: 'armv8'
};

// register map
const REGISTERS = {
  ARM: [
    'r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7',
    'r8', 'r9', 'r10', 'r11', 'ip','sp', 'lr', 'pc',
    'cpsr'
  ],
  X86: [
    'eax', 'ebx', 'ecx', 'edx', 'edi', 'esi', 'ebp',
    'esp', 'ss', 'eflags', 'eip', 'cs', 'ds', 'es',
    'fs', 'gs'
  ],
  X86_64: [
    'rax', 'rbx', 'rcx', 'rdx', 'rdi', 'rsi', 'rbp',
    'rsp', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13',
    'r14', 'r15', 'rip', 'rflags', 'cs', 'fs', 'gs'
  ]
};

/**
 * Finds the CPU arch name using a major/minor type
 * number. If we can't find the arch, we just wrap
 * the major/minor in an "unknown()" binding.
 *
 * @param major the major CPU type.
 * @param minor the minor CPU type.
 * @returns {*} the arch of the CPU type.
 */
function get_cpu_arch(major, minor) {
  if (major === CPU_TYPE_ARM64) {
    return 'arm64';
  }

  if (major === CPU_TYPE_X86) {
    return 'i386';
  }

  if (major === CPU_TYPE_X86_64) {
    return 'x86_64';
  }

  if (major === CPU_TYPE_ARM) {
    return CPU_ARM_TYPES[minor] || 'arm';
  }

  return `unknown(${major},${minor})`
}

/**
 * Returns the CPU type for a given CPU arch.
 *
 * @param arch the arch to return for.
 * @returns {*} the type of the CPU arch.
 */
function get_cpu_type(arch) {
  if (arch !== 'arm64' && arch.startsWith('arm')) {
    return ARCH_TYPES['arm'];
  }
  return ARCH_TYPES[arch] || 'Unknown';
}

/**
 * Returns an array of registers associated with
 * a given CPU arch.
 *
 * @param cpu the CPU arch.
 * @returns {Array} an array of registers.
 */
function get_registers(cpu) {
  cpu = cpu.toLowerCase();

  if (cpu.startsWith('arm')) {
    return REGISTERS.ARM;
  }

  if (~[ 'x86', 'i386', 'i486', 'i686' ].indexOf(cpu)) {
    return REGISTERS.X86;
  }

  if (cpu === 'x86_64') {
    return REGISTERS.X86_64;
  }

  return [];
}

/*
  Exports.
 */

exports.get_cpu_arch = get_cpu_arch;
exports.get_cpu_type = get_cpu_type;
exports.get_registers = get_registers;
