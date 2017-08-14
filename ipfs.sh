#!/usr/bin/env bash

# Script to put current build output onto IPFS.
# adapted from https://github.com/kremalicious/ipfs-hosting/blob/master/deploy.sh
#
# requires ipfs to be installed and running `ipfs daemon`

FOLDER="./_dist"
IPFSLOCAL="http://localhost:8080"

# staging build so we keep Google Analytics & search engines out
gulp build --staging

echo
echo "Adding to IPFS..."
ipfs add -r -q $FOLDER >publish.log || die "Could not add to IPFS"

HASH=$(tail -n1 publish.log)

echo
echo "🎉 Published $FOLDER → $HASH"
echo "    $IPFSLOCAL/ipfs/$HASH"
echo "    https://ipfs.io/ipfs/$HASH"
echo

# add to versions/history
cat <<EOF >> versions/history
$HASH
EOF

# overwrite versions/current
cat <<EOF > versions/current
$HASH
EOF

# purrrrge
rm publish.log

exit
