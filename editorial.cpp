//https://www.spoj.com/status/MAXWOODS,abhinavk_grd/


#include<bits/stdc++.h>
using namespace std;
 
#define ll long long int
 
#define f(a,b)  for(ll i=a;i<b;i++)
#define fr(a,b) for(ll j=a;j>=b;j--)
#define fj(a,b) for(ll j=a;j<b;j++)
#define fk(a,b) for(ll k=a;k<b;k++)
#define add_edge(u,v) adj[u].pb(v); adj[v].pb(u);
 
#define mp make_pair
#define pb push_back
#define vll vector<ll>
#define pll pair <ll ,ll >
#define vpll vector < pair <ll ,ll > >
#define mpll map <ll, ll >
#define F first
#define S second
#define NL cout<<endl;
#define Println(x) cout<<x<<endl;
 
#define TEST() ll t; cin>>t; while(t--)
#define FASTIO ios_base::sync_with_stdio(0); cin.tie(0);
#define DPINIT memset(dp,-1,sizeof(dp));
 
#define N 1000050
ll MOD= 1e9 +7;
 
vll adj[N];
bool visted[N];
 
void init(ll n)
{
    f(0,n+1)
    {
        adj[i].clear();
    }
    memset(visted,false,sizeof(visted));  
}
ll m,n;
char a[205][205];
ll dp[205][205][2];
 
ll solve(ll posr,ll posc,ll dir){
    if(posr>=m || posc>=n || posr<0 || posc<0)
        return 0;
    if(a[posr][posc]=='#')
        return 0;
    ll cut=0;
    if(a[posr][posc]=='T')
        cut=1;
    
    if(dp[posr][posc][dir]!=-1)
        return dp[posr][posc][dir];
    
    if(dir==1)
        dp[posr][posc][dir]=cut+max(solve(posr,posc+1,1),solve(posr+1,posc,0));
    else
    {
        dp[posr][posc][dir]=cut+max(solve(posr,posc-1,0),solve(posr+1,posc,1));   
    }
    return dp[posr][posc][dir];   
}
int main()
{
    FASTIO
 
    TEST()
    {
        DPINIT;
        cin>>m>>n;
        f(0,m){
            fj(0,n){
                cin>>a[i][j];
            }
        }
        cout<<solve(0,0,1)<<endl;;     
    }
        return 0;
}