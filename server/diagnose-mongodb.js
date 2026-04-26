// Diagnostic script for MongoDB connection issues
const dns = require('dns');

const cluster = 'skillsync-cluster.vzwop3a.mongodb.net';
const srvRecord = '_mongodb._tcp.' + cluster;

console.log('🔍 MongoDB Connection Diagnostics');
console.log('================================\n');

// Check DNS resolution
console.log('1. Testing DNS resolution for cluster hostname...');
dns.lookup(cluster, { family: 4 }, (err, address) => {
  if (err) {
    console.log('   ❌ DNS lookup failed:', err.message);
    
    // TRY FORCED DNS
    console.log('   💡 Attempting forced resolution with 8.8.8.8...');
    const originalServers = dns.getServers();
    dns.setServers(['8.8.8.8']);
    dns.resolve4(cluster, (err2, addr2) => {
       if (err2) {
         console.log('      ❌ Still failed with 8.8.8.8:', err2.message);
       } else {
         console.log('      ✅ Resolved with 8.8.8.8! Address:', addr2[0]);
       }
       // Reset
       dns.setServers(originalServers);
    });
  } else {
    console.log('   ✅ DNS resolved to:', address);
  }

  // Check SRV record
  console.log('2. Testing SRV record lookup...');
  dns.resolveSrv(srvRecord, (err, addresses) => {
    if (err) {
      console.log('   ❌ SRV lookup failed:', err.message);
      console.log('   💡 This is why MongoDB connection is failing');
      console.log('   💡 Common causes:');
      console.log('      - Corporate firewall blocking DNS SRV queries');
      console.log('      - ISP blocking MongoDB traffic');
      console.log('      - Cluster is paused in Atlas\n');
    } else {
      console.log('   ✅ SRV records found:', addresses.length);
      addresses.forEach((addr, i) => {
        console.log(`      [${i + 1}] ${addr.name}:${addr.port}`);
      });
    }

    // Check TXT record
    console.log('3. Testing TXT record lookup...');
    dns.resolveTxt(cluster, (err, records) => {
      if (err) {
        console.log('   ❌ TXT lookup failed:', err.message);
      } else {
        console.log('   ✅ TXT records found:', records.length);
      }

      console.log('\n📊 Summary:');
      console.log('   If all lookups fail, your network is blocking MongoDB Atlas.');
      console.log('   Solutions:');
      console.log('   1. Use a VPN (mobile hotspot works well)');
      console.log('   2. Change DNS servers to 8.8.8.8');
      console.log('   3. Contact your network administrator');
      console.log('   4. Install MongoDB locally for development\n');
    });
  });
});
