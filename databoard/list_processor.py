import math

from thinkstats import Pmf
from thinkstats import Cdf


def avg(d):
    return sum(d) * 1.0 / len(d)

class ListProcessor(object):
    def __init__(self, data):
        self.data = data
        
        self._sorted = None
        self._pmf = None
        self._cdf = None
        self._mode = None
        self._dist = None
        self._stdev = None
    
    def sorted_list(self):
        if not self._sorted:
            self._sorted = sorted(self.data)
        return self._sorted

    def pmf(self):
        if not self._pmf:
            self._pmf = Pmf.MakePmfFromList(self.data).render()
        return self._pmf
        
    def cdf(self):
        if not self._cdf:
            self._cdf = Cdf.MakeCdfFromList(self.data).render()
        return self._cdf
        
    def length(self):
        return len(self.data) 

    def min(self):
        return self.sorted_list()[0]

    def max(self):
        return self.sorted_list()[self.length()-1]

    def mean(self):
        return (sum(self.data)*1.0)/self.length()

    def median(self):
        return self.sorted_list()[(self.length()/2)-1]
        
    def unique_count(self):
        return len(self.distribution())

    def mode(self):
        # TODO: Pull last item from sorted distribution
        if not self._mode:
            lv, ln = 0,0
            for n, v in self.distribution():
                if v > lv:
                    lv = v
                    ln = n
            self._mode = ln
        return self._mode

    def distribution(self):
        if not self._dist:
            dist = {}
            for d in self.data:
                dist.setdefault(d, 0)
                dist[d] += 1
            self._dist = [(d, n) for d, n in dist.items()]
            self._dist = sorted(self._dist, key= lambda i: i[0])
        return self._dist

    def standard_deviation(self):
        if not self._stdev:
            variance = map(lambda x: (x - self.mean())**2, self.data)
            self._stdev = math.sqrt(avg(variance))
        return self._stdev
        