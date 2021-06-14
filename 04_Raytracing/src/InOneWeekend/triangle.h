#ifndef TRIANGLE_H
#define TRIANGLE_H
//==============================================================================================
// Originally written in 2016 by Peter Shirley <ptrshrl@gmail.com>
//
// To the extent possible under law, the author(s) have dedicated all copyright and related and
// neighboring rights to this software to the public domain worldwide. This software is
// distributed without any warranty.
//
// You should have received a copy (see file COPYING.txt) of the CC0 Public Domain Dedication
// along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
//==============================================================================================

#include "rtweekend.h"

#include "hittable.h"


class triangle : public hittable {
    public:
        triangle() {}

        triangle(point3 triA, point3 triB, point3 triC, shared_ptr<material> m)
            : a(triA), b(triB), c(triC), mat_ptr(m) {};

        virtual bool hit(
            const ray& r,double t_min, double t_max, hit_record& rec) const override;

    public:
        vec3 a;
        vec3 b;
        vec3 c;
        shared_ptr<material> mat_ptr;
};


bool triangle::hit(const ray& r, double t_min, double t_max,hit_record& rec) const {
   vec3 n = cross(b-a, c-a);
   if (dot(n, r.direction()) > 0) {
			n= -n;
		}
	auto k = dot(a - r.origin(), n) / dot(r.direction(), n);
		if (k >= 0) {
            auto e = 0.001;
			point3 p = r.origin() + r.direction()*k;
            auto at = abs(sqrt(dot(cross(b-a, c-a) ,cross(b-a, c-a) )));
            auto sa = abs(sqrt(dot(cross (b-p, c-p),cross (b-p, c-p))));
			auto sb = abs(sqrt(dot(cross (a-p, c-p),cross (a-p, c-p))));
			auto sc = abs(sqrt(dot(cross (a-p, b-p),cross (a-p, b-p))));
            auto alpha = sa / at;
            auto beta = sb / at;
            auto gamma = sc / at;
			
			if(alpha + beta + gamma < 1+e && alpha + beta + gamma > 1-e && k >=t_min && k<= t_max ){
               rec.t = k;
               rec.p = p;
               vec3 outward_normal = n / abs(sqrt(dot(n,n)));
               rec.set_face_normal(r, outward_normal);
               rec.mat_ptr = mat_ptr;
               return true; 
            } else {
                return false;
            }
		}
		else {
			return false;
		}
	
}


#endif
