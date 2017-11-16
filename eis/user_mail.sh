#!/bin/sh
# Author:  M. Pani

FILENAMEOUT="/work/fac/eis/output.log" 
recipients="marco.pani@cedacri.it"
logf=/tmp/auditmail_gov.log
echo " eis "  > $logf
echo " check at : "  $(date) >> $logf
mail -r "noreply@ced.it" -a $FILENAMEOUT  -s " idaa r30 " $recipients <  $logf

exit 0




