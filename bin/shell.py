import sys
import shlex
import os
from multiprocessing import Process

SHELL_STATUS_RUN = 0
SHELL_STATUS_STOP = 1

def tokenize(string) :
    return shlex.split(string)

def run_proc(name):
    print('运行子进程%s(%s)......'%(name,os.getpid()))

def execute(cmd_tokens) :
    p = Process(target=run_proc,args=(cmd_tokens[0],))
    p.start()
    pid = int(p.pid) #os.fork()
    print(pid)
    if pid == 0:
        os.execvp(cmd_tokens[0], cmd_tokens)
    elif pid>0:
        while True:
            wpid, status = os.waitpid(pid, 0)
            if os.WIFEXISTED(status) or os.WIFSIGNALED(status):
               break

    return SHELL_STATUS_RUN

def shell_loop():
    status = SHELL_STATUS_RUN
    while status == SHELL_STATUS_RUN:
        sys.stdout.write("> ")
        sys.stdout.flush
        cmd = sys.stdin.readline()
        cmd_tokens = tokenize(cmd)
        status = execute(cmd_tokens)

def main():
    shell_loop()

if __name__ == "__main__":
    main()
